import { ShippingTaxSummaryLine, TaxSummary, ProductTaxSummaryLine, TaxTotal } from "./tax-summary";
import { Order } from "@vendure/core";

export class TaxHelper {

    /**
     * Get taxSummary per one or multiple orders
     */
    static getTaxSummary(order: Order): TaxSummary {
        const summaryLines: ProductTaxSummaryLine[] = order.lines?.map(line =>
        ({
            name: `${line.productVariant.sku} ${line.productVariant.name}`,
            orderCode: order.code,
            quantity: line.quantity,
            unitPriceIncVAT: line.unitPriceWithTax,
            taxRate: line.taxRate,
            exVAT: line.linePrice,
            incVAT: line.linePriceWithTax,
            VAT: line.lineTax
        })
        );
        let totalIncVAT = order.totalWithTax
        let totalExVAT = order.subTotal; // this excludes shipping
        let totalVAT = order.taxSummary.map(summary => summary.taxTotal).reduce((a, b) => a + b); // total taxes without shippingTax
        // Calculate shipping
        const maxTax = Math.max(...order.taxSummary.map(summary => summary.taxRate));
        const taxMultiplier = maxTax / 100 + 1; // I.E. 21% = 1.21
        const shippingExVAT = order.shipping / taxMultiplier; // Shipping in DB should always be including tax
        const shipping: ShippingTaxSummaryLine = {
            name: `Shipping ${maxTax}% ${order.code}`,
            orderCode: order.code,
            taxRate: maxTax,
            incVAT: order.shipping,
            exVAT: this.round(shippingExVAT),
            VAT: this.round(order.shipping - shippingExVAT)
        };
        // Calculate totals inc shipping
        // totalIncVAT += shipping.incVAT;
        totalExVAT += shipping.exVAT;
        totalVAT += shipping.VAT;
        // Calculate total taxes spend
        const taxTotal: TaxTotal = {};
        order.taxSummary.map(summary => taxTotal[summary.taxRate] = summary.taxTotal);
        taxTotal[shipping.taxRate] += shipping.VAT;
        return {
            products: summaryLines,
            shipping: [shipping],
            taxTotal,
            totalIncVAT: this.round(totalIncVAT),
            totalExVAT: this.round(totalExVAT),
            totalVAT: this.round(totalVAT)
        };
    }

    /**
     * Round to whole numbers, because cents
     */
    static round(nr: number): number {
        return Math.round(nr || 0);
    }
}