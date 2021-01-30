import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';
import { AnalyticsController } from './analytics.controller';
import { ChannelConfigPlugin } from '../channel-config/channel-config.plugin';
import { AnalyticsService } from './analytics.service';

/**
 * Basic analytics based on database orders.
 * Sends emails to channelAdministrators
 */
@VendurePlugin({
    imports: [PluginCommonModule, ChannelConfigPlugin],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsPlugin {
}
