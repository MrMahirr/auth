import { ApiClient } from "../client/apiClient";
import { AuthResponse, GoogleLoginDto, LoginDto, LoginResponse, RegisterDto } from "../domain/Auth.model";

export class AuthGateway {
    private api = new ApiClient();

    async login(payload: LoginDto): Promise<LoginResponse> {
        const response = await this.api.post<LoginResponse>("/users/login", {
            user: payload,
        });
        return response.data;
    }

    register(payload: RegisterDto) {
        return this.api.post<AuthResponse>("/users", payload);
    }

    async googleLogin(payload: GoogleLoginDto): Promise<LoginResponse> {
        const response = await this.api.post<LoginResponse>("/users/google-login", payload);
        return response.data;
    }

    me() {
        return this.api.get<AuthResponse>("/user");
    }

    logout() {
        return this.api.post("/logout");
    }

    async refresh(refreshToken: string): Promise<LoginResponse> {
        const response = await this.api.post<LoginResponse>("/refresh", { token: refreshToken });
        return response.data;
    }
}
