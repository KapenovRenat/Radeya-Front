import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import {Product} from "@/types/products/products";

export interface ProductsState {
    product: Product;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    product: {
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
export const getProducts = createAsyncThunk<
    Product, // что вернём
    { page: number; limit: number, search?: string }, // аргументы
    { rejectValue: string } // ошибка
>("/products", async ({ page, limit, search }, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("/products", { page, limit, search });

        return res.data as Product;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка входа");
    }
});

// 🧩 Slice
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Не удалось войти";
            })
    },
});

export default productsSlice.reducer;
