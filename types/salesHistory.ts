export interface ISalesHistoryItem {
    productId: string | null;
    name: string | null;
    code: string | null;
    imageUrl: string | null;
    sellQty: number;
    sellSum: number;
    costSum: number;
    profit: number;
    profitPct: number;
    salesPerDay: number;
    stockQty: number;
    reserve: number;
    inTransit: number;
    available: number;
}

export interface SalesHistoryState {
    items: ISalesHistoryItem[];
    total: number;
    loading: boolean;
    error: string | null;
}
