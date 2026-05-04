import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@/store/reducers/auth";
import productReducer from "@/store/reducers/products/products";
import suppliersReducer from "@/store/reducers/suppliers";
import purchaseOrdersReducer from "@/store/reducers/purchaseOrders";
import salesHistoryReducer from "@/store/reducers/salesHistory";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        suppliers: suppliersReducer,
        purchaseOrders: purchaseOrdersReducer,
        salesHistory: salesHistoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;