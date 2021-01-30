import { Connection } from 'typeorm';
import { ChannelConfigService } from '../channel-config/channel-config.service';
import { Injectable } from '@nestjs/common';
import { Channel, Order } from '@vendure/core';
import { ChannelConfig } from '../channel-config/channel-config';
import { AnalyticsProduct, BasicAnalytics } from './basic-analytics';

@Injectable()
export class AnalyticsService {
    constructor(private connection: Connection, private channelService: ChannelConfigService) {
    }

    /**
     * Send an email to all Most sold products (1, 2 and 3), Average order value, Shopping cart abandonment rate, Recurring customers
     */
    async sendMonthlyEmail(): Promise<void> {
        console.log(`Sending analytics email to all channel owners.`);
        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        startOfLastMonth.setDate(1);
        startOfLastMonth.setHours(0);
        startOfLastMonth.setMinutes(0);
        startOfLastMonth.setSeconds(0);
        const endOfLastMonth = new Date(startOfLastMonth.getTime());
        endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
        const channels = await this.connection
            .getRepository(Channel)
            .createQueryBuilder('channel')
            .getMany();
        for (const channel of channels) {
            const config = await this.channelService.getConfig(channel.token).catch(e => console.error(e)) as ChannelConfig;
            if (!config?.supportEmail) {
                console.error(`Not sending analytics email for channel ${channel.token} because no support email was found`);
                continue;
            }
            const data = await this.getBasicAnalytis({
                channelId: channel.id,
                channelName: config.channelName,
                from: startOfLastMonth,
                to: endOfLastMonth
            });
            console.log(`Analytics: `, data);

        }
    }

    async getBasicAnalytis(parameters: { channelId: string | number, channelName: string, from: Date, to: Date }): Promise<BasicAnalytics> {
        const monthName = parameters.from.toLocaleString('nl-NL', { month: 'long' });
        console.log(`Getting analytics for channel ${parameters.channelName} for month ${monthName}`);
        const orders = await this.connection
            .getRepository(Order)
            .createQueryBuilder('order')
            .leftJoin('order.channels', 'channel')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user') // Used in de 'Order' query, guess this didn't work before?
            .leftJoinAndSelect('order.lines', 'lines')
            .leftJoinAndSelect('lines.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.productVariantPrices', 'prices')
            .leftJoinAndSelect('productVariant.product', 'product')
            .leftJoinAndSelect('product.translations', 'productTranslations')
            .leftJoinAndSelect('lines.featuredAsset', 'featuredAsset')
            .leftJoinAndSelect('lines.items', 'items')
            .where('channel.id = :channelId', { channelId: parameters.channelId })
            .andWhere('order.createdAt > :from', { from: parameters.from })
            .andWhere('order.createdAt < :to', { to: parameters.to })
            .getMany();

        let totalRevenue = 0;
        let newCustomers = 0;
        let recurringCustomers = 0;
        let finishedOrders = 0;
        let abandonedOrders = 0;
        const products: AnalyticsProduct[] = [];

        orders.forEach(order => { // Finished orders
            if (order.state === 'Delivered' || order.state === 'PaymentSettled' || order.state === 'Shipped') {
                finishedOrders++;
                totalRevenue += order.total;
                if (order.customer?.createdAt! >= parameters.from) {
                    newCustomers++;
                } else if (order.customer) {
                    recurringCustomers++;
                }
                order.lines.forEach(line => { // Calculate best sold products based on line
                    const productName = line.productVariant?.product?.translations?.[0]?.name;
                    if (!productName) {
                        return;
                    }
                    const product = products.find(p => p.name === productName) || {
                        name: productName,
                        totalRevenue: 0,
                        timesSold: 0
                    };
                    product.totalRevenue += line.linePriceWithTax;
                    product.timesSold += line.quantity;
                })
            } else { // created but not paid
                abandonedOrders++;
            }
        });
        const bestSoldProducts = products
            .sort((p1, p2) => p1.totalRevenue - p2.totalRevenue)
            .slice(0, 3);

        return {
            shopOwnerName: parameters.channelName,
            month: monthName,
            totalRevenue,
            bestSoldProducts,
            averageOrderValue: totalRevenue / finishedOrders,
            cartAbandonmentRate: (abandonedOrders / orders.length) * 100,
            newCustomers,
            recurringCustomers
        }
    }

}