/**
 * Tax summary for one or multiple orders
 */
export interface TaxSummary {
    products: ProductTaxSummaryLine[];
    shipping: ShippingTaxSummaryLine[];
    taxTotal: TaxTotal;
    totalVAT: number;
    totalExVAT: number;
    totalIncVAT: number;
}

export interface TaxSummaryLine {
    name: string;
    orderCode: string;
    taxRate: number;
    incVAT: number;
    exVAT: number;
    VAT: number;
}

/**
 * Shipping VAT calculation per order
 */
export interface ShippingTaxSummaryLine extends TaxSummaryLine {
}

/**
 * Tax per productVariant/item. Includes rate, exVAT, incVAT and total amount of VAT and orderCode
 */
export interface ProductTaxSummaryLine extends TaxSummaryLine {
    quantity: number;
    unitPriceIncVAT: number;
}

export interface TaxTotal {
    [key: number]: number;
}

/*const a = {
    'lines': [
        {name: 'Ben de Boef shirt maat L', amount: 2, unitPriceIncVAT: 70, taxRate: 21, totalIncVAT: 140, totalExVat: 115.7,  totalVat: 24.3},
      ]
     shipping: [
             {name: 'Shipping 9%', amount: 1, unitPriceIncVAT: 6.65, taxRate: 9, totalIncVAT: 140, totalExVat: 115.7,  totalVat: 24.3}
     ]
}*/

