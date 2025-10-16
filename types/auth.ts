export type Role = "user" | "manager" | "admin";

export interface User {
    id?: string;
    login: string;
    password?: string;
    role?: Role;
}