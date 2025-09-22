import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isAuth: boolean;           // true, если пользователь вошёл в систему
    user: { name: string } | null; // данные пользователя (имя и т.д.)
}

const initialState: UserState = {
    isAuth: false,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // задаёт данные пользователя и устанавливает флаг авторизации
        setUser(state, action: PayloadAction<{ name: string }>) {
            state.user = action.payload;
            state.isAuth = true;
        },
        // сброс данных при логауте
        logout(state) {
            state.user = null;
            state.isAuth = false;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;