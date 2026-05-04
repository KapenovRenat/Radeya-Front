import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import { ISupplier, SuppliersState } from "@/types/suppliers";

const initialState: SuppliersState = {
    items: [],
    total: 0,
    loading: false,
    syncing: false,
    error: null,
};

export const fetchSuppliers = createAsyncThunk<
    { total: number; items: ISupplier[] },
    void,
    { rejectValue: string }
>("suppliers/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await apiAxis.get("/mysklad/suppliers");
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка получения поставщиков");
    }
});

export const syncSuppliers = createAsyncThunk<
    { total: number; items: ISupplier[] },
    void,
    { rejectValue: string }
>("suppliers/sync", async (_, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("/mysklad/suppliers/sync");
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка синхронизации поставщиков");
    }
});

const suppliersSlice = createSlice({
    name: "suppliers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ошибка";
            })
            .addCase(syncSuppliers.pending, (state) => {
                state.syncing = true;
                state.error = null;
            })
            .addCase(syncSuppliers.fulfilled, (state, action) => {
                state.syncing = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(syncSuppliers.rejected, (state, action) => {
                state.syncing = false;
                state.error = action.payload ?? "Ошибка";
            });
    },
});

export default suppliersSlice.reducer;
