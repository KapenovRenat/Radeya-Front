import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {User} from "@/types/auth";
import apiAxis from "@/utils/axios";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// 🟢 Асинхронный thunk: логин
export const loginUser = createAsyncThunk<
    User, // что вернём
    { login: string; password: string }, // аргументы
    { rejectValue: string } // ошибка
>("auth/login", async ({ login, password }, { rejectWithValue }) => {
    try {
        const res = await apiAxis.post("auth/login", { login, password });

        return res.data.user as User;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка входа");
    }
});

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiAxis.get("/auth/me");
            return res.data.user as User;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Не авторизован");
        }
    }
);

// 🧩 Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Не удалось войти";
            }).addCase(fetchMe.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
            .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
