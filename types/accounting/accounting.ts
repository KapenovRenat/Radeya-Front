interface AccountingItem {
    id: string;
    name: string;
    type: 'kaspi' | 'ncity';
    countOrders: number | null;
    sum: number | null;
}

export interface Accounting {
    page: number | null,
    limit: number | null | undefined,
    total: number | null | undefined,
    pages: number | null |  undefined,
    items: Array<AccountingItem>,
}