import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { BlogService } from "../services/blog.service";

import { gatewayContainer } from "./gatewayContainer";

export const serviceContainer = {
    authService: new AuthService(gatewayContainer.authGateway),
    userService: new UserService(gatewayContainer.userGateway),
    blogService: new BlogService(gatewayContainer.blogGateway),
};
