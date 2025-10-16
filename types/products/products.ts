export interface ProductItem {
    _id: string;
    msId: string;
    article: string;
    createdAt: string;
    imageUrl: string;
    kaspiLink: string;
    kaspiPrice: number;
    name: string;
    purchasePrice: number;
    supplier: {
        name: string;
        count: number;
    };
    updatedAt: string;
    updatedAtMs: string;
}

export interface Product {
    page: number | null,
    limit: number | null,
    total: number | null,
    pages: number | null,
    items: Array<ProductItem>,
}
