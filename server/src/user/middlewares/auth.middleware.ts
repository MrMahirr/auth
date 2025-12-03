import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserService } from '@/user/user.service';
import { AuthRequest } from '@/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { UserEntity } from '@/user/user.entity';
import { CustomJwtPayload } from '@/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: AuthRequest, _res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const decode = verify(token, secret) as CustomJwtPayload;
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next();
    } catch {
      req.user = new UserEntity();
      next();
    }
  }
}

export default AuthMiddleware;
