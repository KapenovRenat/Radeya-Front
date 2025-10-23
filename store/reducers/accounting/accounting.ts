import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import {Accounting} from "@/types/accounting/accounting";

export interface ProductsState {
    accounting: Accounting;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    accounting: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        items: [],
    },
    loading: false,
    error: null,
};

// 🟢 Асинхронный thunk: логин
export const getAccounting = createAsyncThunk<
    Accounting, // что вернём
    { page: number; limit: number}, // аргументы
    { rejectValue: string } // ошибка
>("/list-accounting", async ({ page, limit }, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("/list-accounting", { page, limit });

        return res.data as Accounting;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка Получения Таблиц Учета");
    }
});

// 🧩 Slice
const accountingSlice = createSlice({
    name: "accounting",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAccounting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAccounting.fulfilled, (state, action) => {
                state.loading = false;
                state.accounting = action.payload;
            })
            .addCase(getAccounting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Не удалось получить таблицы!";
            })
    },
});

export default accountingSlice.reducer;
