import { AuthGateway } from "../gateway/auth.gateway";
import { GoogleLoginDto, LoginDto, LoginResponse, RegisterDto } from "../domain/Auth.model";

export class AuthService {
    constructor(private gateway: AuthGateway) { }

    async login(dto: LoginDto): Promise<LoginResponse> {
        const response = await this.gateway.login(dto);
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));

        return response;
    }
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    async register(data: RegisterDto) {
        const res = await this.gateway.register(data);
        return res;
    }

    async googleLogin(data: GoogleLoginDto) {
        const res = await this.gateway.googleLogin(data);
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        return res;
    }

}
