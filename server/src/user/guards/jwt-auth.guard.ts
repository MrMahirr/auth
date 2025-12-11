import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/user/user.entity';

type JwtPayload = {
  id: number;
  email: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      if (!payload?.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Kullanıcıyı veritabanında ara
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Güvenlik için şifreyi kaldır
      delete user.password;

      return user;
    } catch (error: unknown) {
      // 🔥 Hata güvenli şekilde loglanmalı
      if (error instanceof Error) {
        console.error('[JwtAuthGuard.validate] Kullanıcı doğrulama hatası:', {
          message: error.message,
          payloadId: payload?.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[JwtAuthGuard.validate] Bilinmeyen hata:', {
          raw: error,
          payloadId: payload?.id,
          timestamp: new Date().toISOString(),
        });
      }

      // UnauthorizedException ise olduğu gibi fırlat
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Kullanıcı doğrulama başarısız');
    }
  }
}
