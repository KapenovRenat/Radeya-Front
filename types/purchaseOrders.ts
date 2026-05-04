export interface IPurchaseOrder {
    id: string;
    name: string | null;
    externalCode: string | null;
    moment: string | null;
    created: string | null;
    updated: string | null;
    applicable: boolean;
    printed: boolean;
    published: boolean;
    sum: number | null;
    payedSum: number | null;
    shippedSum: number | null;
    invoicedSum: number | null;
    waitSum: number | null;
    vatSum: number | null;
    vatEnabled: boolean;
    vatIncluded: boolean;
    agent: { id: string | null; href: string | null };
    store: { id: string | null; href: string | null };
    state: { id: string | null; href: string | null };
    positionsCount: number;
    suppliesCount: number;
    customerOrdersCount: number;
}

export interface PurchaseOrdersState {
    items: IPurchaseOrder[];
    total: number;
    count: number;
    loading: boolean;
    error: string | null;
}
