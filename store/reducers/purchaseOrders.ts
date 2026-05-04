import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import { IPurchaseOrder, PurchaseOrdersState } from "@/types/purchaseOrders";

const initialState: PurchaseOrdersState = {
    items: [],
    total: 0,
    count: 0,
    loading: false,
    error: null,
};

export const fetchPurchaseOrders = createAsyncThunk<
    { total: number; count: number; items: IPurchaseOrder[] },
    { supplierId?: string; dateFrom?: string; dateTo?: string },
    { rejectValue: string }
>("purchaseOrders/fetch", async ({ supplierId, dateFrom, dateTo }, { rejectWithValue }) => {
    try {
        const params: Record<string, string> = {};
        if (supplierId) params.supplierId = supplierId;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        const res = await apiAxis.get("/mysklad/purchase-orders", { params });
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка получения закупок");
    }
});

const purchaseOrdersSlice = createSlice({
    name: "purchaseOrders",
    initialState,
    reducers: {
        clearPurchaseOrders: (state) => {
            state.items = [];
            state.total = 0;
            state.count = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.count = action.payload.count;
            })
            .addCase(fetchPurchaseOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ошибка";
            });
    },
});

export const { clearPurchaseOrders } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
