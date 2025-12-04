import { AuthGateway } from "../gateway/auth.gateway";
import { UserGateway } from "../gateway/user.gateway";
import { BlogGateway } from "../gateway/blog.gateway";

export const gatewayContainer = {
    authGateway: new AuthGateway(),
    userGateway: new UserGateway(),
    blogGateway: new BlogGateway(),
};
