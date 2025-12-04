export interface Blog {
    id?: string;
    title: string;
    content: string;
    image: string;
    category: string;
    createdAt?: string;
    created_at?: any;
    author?: {
        id: string;
        username: string;
    };
}
export interface CreateBlogDto {
    title: string;
    content: string;
    image: string;
    category: string;

}
export interface UpdateBlogDto {
    title: string;
    content: string;
    image: string;
    category: string;
}