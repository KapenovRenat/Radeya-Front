import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@/store/reducers/auth";
import productReducer from "@/store/reducers/products/products";

export const store = configureStore({
    reducer: { auth: authReducer, products: productReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;