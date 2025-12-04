import { BlogGateway } from "../gateway/blog.gateway";

export class BlogService {
    constructor(private gateway: BlogGateway) { }

    async createBlog(payload: any) {
        const res = await this.gateway.createBlog(payload);
        return res.data;
    }

    async updateBlog(id: string, payload: any) {
        const res = await this.gateway.updateBlog(id, payload);
        return res.data;
    }

    async getBlogs() {
        const res = await this.gateway.getBlogs();
        return res.data;
    }

    async deleteBlog(id: string) {
        const res = await this.gateway.deleteBlog(id);
        return res.data;
    }

    async uploadImage(file: File) {
        const res = await this.gateway.uploadImage(file);
        return res.data;
    }
}
