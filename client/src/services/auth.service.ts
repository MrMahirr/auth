import { AuthGateway } from "../gateway/auth.gateway";
import { GoogleLoginDto, LoginDto, LoginResponse, RegisterDto } from "../domain/Auth.model";

export class AuthService {
    constructor(private gateway: AuthGateway) { }

    async login(dto: LoginDto): Promise<LoginResponse> {
        const response = await this.gateway.login(dto);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        // Refresh token HTTP-only cookie'de

        return response;
    }

    async logout() {
        try {
            await this.gateway.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            // Refresh token cookie backend tarafından temizlenir
        }
    }

    async register(data: RegisterDto) {
        const res = await this.gateway.register(data);
        return res;
    }

    async googleLogin(data: GoogleLoginDto) {
        const res = await this.gateway.googleLogin(data);
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        // Refresh token HTTP-only cookie'de
        return res;
    }

    // refreshToken metodu kaldırıldı - axios interceptor otomatik hallediyor
}
