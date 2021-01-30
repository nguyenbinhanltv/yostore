require('dotenv').config({ path: process.env.SHOP_ENV });
import {bootstrap} from '@vendure/core';
import {getConnection} from 'typeorm';
import {config} from '../src/vendure-config';
(async() => {

    await bootstrap(config);
    await getConnection()
        .createQueryBuilder()
        .insert()
        .into('product_variant_channels_channel')
        .values([
            { productVariantId: 1, channelId: 2 },
        ])
        .execute();

    await getConnection()
        .createQueryBuilder()
        .insert()
        .into('product_channels_channel')
        .values([
            { productId: 1, channelId: 2 },
        ])
        .execute();

    process.exit(0);
})();