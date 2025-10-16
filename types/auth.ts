export type Role = "user" | "manager" | "admin";

export interface User {
    id?: string;
    login: string;
    password?: string;
    role?: Role;
}

export interface UserState {
    account: User | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error?: string | null;
}