import { ApiClient } from "../client/apiClient";
import { Blog, CreateBlogDto, UpdateBlogDto } from "../domain/Blog.model";

export class BlogGateway {
    private api = new ApiClient();

    createBlog(data: CreateBlogDto) {
        return this.api.post<Blog>("/blogs", data);
    }

    updateBlog(id: string, data: UpdateBlogDto) {
        return this.api.put<Blog>(`/blogs/${id}`, data);
    }

    getBlogs() {
        return this.api.get<Blog[]>("/blogs");
    }

    deleteBlog(id: string) {
        return this.api.delete(`/blogs/${id}`);
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        return this.api.post<{ url: string }>("/upload?folder=blogs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}
