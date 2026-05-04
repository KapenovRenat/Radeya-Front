export interface ISupplier {
    _id: string;
    msId: string;
    name: string;
    externalCode: string | null;
    companyType: string | null;
    phone: string | null;
    email: string | null;
    actualAddress: string | null;
    tags: string[];
    archived: boolean;
    salesAmount: number;
    createdAtMs: string | null;
    updatedAtMs: string | null;
}

export interface SuppliersState {
    items: ISupplier[];
    total: number;
    loading: boolean;
    syncing: boolean;
    error: string | null;
}
