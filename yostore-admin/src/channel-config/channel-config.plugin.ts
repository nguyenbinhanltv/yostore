import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ChannelConfigService } from './channel-config.service';

/**
 * Basic analytics based on database orders.
 * Sends emails to channelAdministrators
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ChannelConfigService],
    exports: [ChannelConfigService],
})
export class ChannelConfigPlugin {
}
