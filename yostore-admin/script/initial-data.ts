import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
    defaultLanguage: LanguageCode.en,
    countries: [
        { name: 'Nederland', code: 'nl', zone: 'Europe' },
        { name: 'België', code: 'be', zone: 'Europe' },
        { name: 'Duitsland', code: 'de', zone: 'Europe' },
    ],
    defaultZone: 'Europe',
    taxRates: [
        { name: 'Standard tax', percentage: 21 },
        { name: 'Reduced tax', percentage: 9 },
        { name: 'Zero tax', percentage: 0 },
    ],
    shippingMethods: [
        { name: 'Verzenden met PostNL', price: 675 },
        { name: 'Ophalen Cornelis Trooststraat 48', price: 0 }
        ],
    collections: [
        {
            name: 'RISOPRINT',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['risoprint'], containsAny: false },
                },
            ]
        },
        {
            name: 'DIBOND',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['dibond'], containsAny: false },
                },
            ]
        },
        {
            name: 'FINEART',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['fineart'], containsAny: false },
                },
            ]
        },
        {
            name: 'POSTCARDS',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['postcards'], containsAny: false },
                },
            ]
        },
    ],
};