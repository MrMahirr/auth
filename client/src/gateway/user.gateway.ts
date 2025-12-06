import { ApiClient } from "../client/apiClient";
import { User, UpdateUserDto } from "../domain/User.model";

export class UserGateway {
    private api = new ApiClient();

    updateUser(data: UpdateUserDto) {
        return this.api.put<User>("/user", { user: data });
    }

    getUser() {
        return this.api.get<User>("/user");
    }

    getProfile() {
        return this.api.get<User>("/profile");
    }

    uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        return this.api.post<{ url: string }>("/upload?folder=users", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    deleteAvatar(filename: string) {
        return this.api.delete("/upload", {
            data: { filename, folder: "users" },
        });
    }

}
