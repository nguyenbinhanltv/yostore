import { Injectable } from '@nestjs/common';
import { ChannelConfig } from './channel-config';

/**
 * In our multi-tenant environment, we need some additional config per channel.
 */
@Injectable()
export class ChannelConfigService {

    private channelConfig: ChannelConfig[] = [
        {
            channelName: 'de Pinelab Demo Shop',
            channelToken: 'demo',
            logoUrl: 'https://shop.marcdefotograaf.nl/marcdefotograaf.png',
            supportEmail: 'martijn@pinelab.studio'
        }, {
            channelName: 'Marc de Fotograaf',
            channelToken: 'marcdefotograaf9283',
            logoUrl: 'https://shop.marcdefotograaf.nl/marcdefotograaf.png',
            supportEmail: 'info@marcdefotograaf.nl'
        }, {
            channelName: 'Ben de Boef',
            channelToken: 'bendeboef',
            logoUrl: 'https://pinelab-demo-shop.netlify.app/bendeboeflogo.png',
            supportEmail: 'martijn@pinelab.studio'
        }, {
            channelName: 'Daniel van de Haterd',
            channelToken: 'danielvdhaterd',
            logoUrl: 'https://dvandehaterd.nl/logo.png',
            supportEmail: 'daniel@dertienhoog.nl'
        }
    ]

    async getConfig(channelToken: string): Promise<ChannelConfig> {
        const config = this.channelConfig.find(c => c.channelToken === channelToken);
        if (!config) {
            throw Error(`No config found for channel ${channelToken}`);
        }
        return config;
    }
}