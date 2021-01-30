export interface BasicAnalytics {
    shopOwnerName: string;
    month: string;
    totalRevenue: number;
    bestSoldProducts: AnalyticsProduct[];
    averageOrderValue: number;
    cartAbandonmentRate: number;
    newCustomers: number;
    recurringCustomers: number;
}

export interface AnalyticsProduct {
    name: string;
    totalRevenue: number;
    timesSold: number;
}