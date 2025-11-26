import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TagModule } from '@/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@/ormconfig';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from '@/blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TagModule,
    UserModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
