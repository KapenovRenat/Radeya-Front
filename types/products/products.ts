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
    limit: number | null | undefined,
    total: number | null | undefined,
    pages: number | null |  undefined,
    items: Array<ProductItem>,
}

export interface ProductItemKM {
    id: string;
    article: string;
    name: string;
    isActiveKaspi?: string;
    storeId?: string;
    storeOrder?: string;
    currentPrice?: number;
    previewImgUrl?: string;
    updatedAt: string;
}

export interface ProductKM {
    page: number | null,
    limit: number | null | undefined,
    total: number | null | undefined,
    pages: number | null |  undefined,
    items: Array<ProductItemKM>,
}
