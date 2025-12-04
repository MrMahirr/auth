import type { AuthUser } from "./auth";

export type BlogSource = "firestore" | "postgres";

export interface BlogBase {
    id?: string;
    title: string;
    content: string;
    image?: string;
    category?: string;
}

export interface Blog extends BlogBase {
    createdAt?: string;
    created_at?: string | Date;
    author?: AuthUser | { id?: string | number; username?: string };
    dbSource?: BlogSource;
    [key: string]: any;
}

export interface BlogFormData extends BlogBase {
    created_at?: Date;
    dbSource?: BlogSource;
    [key: string]: any;
}


