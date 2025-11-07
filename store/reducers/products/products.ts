import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxis from "@/utils/axios";
import {Product, ProductKM} from "@/types/products/products";

export interface ProductsState {
    product: Product;
    productKM: ProductKM;
    loading: boolean;
    loadingProductKaspi: boolean;
    msgProductKaspi: string | null;
    loadingProductKaspiData: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    product: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        items: [],
    },
    productKM: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        items: [],
    },
    loading: false,
    loadingProductKaspi: false,
    msgProductKaspi: null,
    loadingProductKaspiData: false,
    error: null,
};

// 🟢 Асинхронный thunk: получение продуктов Мой склад
export const getProducts = createAsyncThunk<
    Product, // что вернём
    { page: number; limit: number, search?: string }, // аргументы
    { rejectValue: string } // ошибка
>("/products", async ({ page, limit, search }, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("/products", { page, limit, search });

        return res.data as Product;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка Получения товаро из Моего Склада");
    }
});

// 🟢 Асинхронный thunk: Синк Каспи
export const syncKaspiProduct = createAsyncThunk<
    {message: string}, // что вернём
    { }, // аргументы
    { rejectValue: string } // ошибка
>("/update-kaspi-products", async ({}, { rejectWithValue }) => {
    try {
        const res = await apiAxis.get("/products/update-kaspi-products");

        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка Синхронизации с Каспи");
    }
});

// 🟢 Асинхронный thunk: Получение товаров Каспи
export const getKaspiProduct = createAsyncThunk<
    ProductKM, // что вернём
    { page: number; limit: number, search?: string }, // аргументы
    { rejectValue: string } // ошибка
>("/get-kaspi-product", async ({ page, limit, search }, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("/products/get-kaspi-product", { page, limit, search });

        return res.data as ProductKM;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка Получения Товаров Каспи");
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
                state.error = action.payload ?? "Не удалось получит товары с моего склада";
            })
            .addCase(syncKaspiProduct.pending, (state) => {
                state.loadingProductKaspi = true;
                state.error = null;
            })
            .addCase(syncKaspiProduct.fulfilled, (state, action) => {
                state.loadingProductKaspi = false;
                state.msgProductKaspi = action.payload.message;
            })
            .addCase(syncKaspiProduct.rejected, (state, action) => {
                state.loadingProductKaspi = false;
                state.error = action.payload ?? "Синхронизация не удалась!";
            })
            .addCase(getKaspiProduct.pending, (state) => {
                state.loadingProductKaspiData = true;
                state.error = null;
            })
            .addCase(getKaspiProduct.fulfilled, (state, action) => {
                state.loadingProductKaspiData = false;
                state.productKM = action.payload;
            })
            .addCase(getKaspiProduct.rejected, (state, action) => {
                state.loadingProductKaspiData = false;
                state.error = action.payload ?? "Не удалось получить товары с Каспи!";
            })
    },
});

export default productsSlice.reducer;
