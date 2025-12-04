import { UserGateway } from "../gateway/user.gateway";

export class UserService {
    constructor(private gateway: UserGateway) { }

    async updateUser(data: any) {
        const user = await this.gateway.updateUser(data);
        return user.data;
    }

    async getUser() {
        const user = await this.gateway.getUser();
        return user.data;
    }

    async uploadAvatar(file: File) {
        const res = await this.gateway.uploadAvatar(file);
        return res.data;
    }

    async deleteAvatar(filename: string) {
        const res = await this.gateway.deleteAvatar(filename);
        return res.data;
    }
}
