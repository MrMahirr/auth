import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@/user/types/user.type';

export const User = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: IUser }>();
    const user = request.user;
    if (!user) {
      return undefined;
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
