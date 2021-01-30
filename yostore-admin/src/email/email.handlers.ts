import { EmailEventHandler, EmailEventListener } from "@vendure/email-plugin";
import { OrderStateTransitionEvent } from "@vendure/core";
import { TaxHelper } from "../tax/tax.helper";
import { ChannelConfigService } from '../channel-config/channel-config.service';

export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && event.fromState !== 'Modifying' && !!event.order.customer)
    .loadData(async ({ event, injector }) => {
        const config = await injector.get(ChannelConfigService).getConfig(event.ctx.channel.token);
        return { config };
    })
    .setRecipient(event => `${event.order.customer!.emailAddress},${event.data.config?.supportEmail}`)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Bedankt voor je bestelling bij {{ channelName }} met nr. {{ order.code }}`)
    .setTemplateVars(event => {
        const summary = TaxHelper.getTaxSummary(event.order);
        return {
            order: event.order,
            summary,
            ...(event.data.config ? event.data.config : {})
        };
    });

export const shopsMailHandlers: Array<EmailEventHandler<any, any>> = [
    orderConfirmationHandler
];
