import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import { ISalesHistoryItem, SalesHistoryState } from "@/types/salesHistory";

const initialState: SalesHistoryState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
};

export const fetchSalesHistory = createAsyncThunk<
    { total: number; items: ISalesHistoryItem[] },
    { supplierId?: string; dateFrom?: string; dateTo?: string },
    { rejectValue: string }
>("salesHistory/fetch", async ({ supplierId, dateFrom, dateTo }, { rejectWithValue }) => {
    try {
        const params: Record<string, string> = {};
        if (supplierId) params.supplierId = supplierId;
        if (dateFrom)   params.dateFrom   = dateFrom;
        if (dateTo)     params.dateTo     = dateTo;
        const res = await apiAxis.get("/mysklad/sales-history", { params });
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка получения истории продаж");
    }
});

const salesHistorySlice = createSlice({
    name: "salesHistory",
    initialState,
    reducers: {
        clearSalesHistory: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalesHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchSalesHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ошибка";
            });
    },
});

export const { clearSalesHistory } = salesHistorySlice.actions;
export default salesHistorySlice.reducer;
