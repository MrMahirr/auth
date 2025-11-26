// import {
//   MiddlewareConsumer,
//   Module,
//   NestModule,
//   RequestMethod,
// } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BlogEntity } from '@/blog/blog.entity';
// import { BlogService } from '@/blog/blog.services';
// import { BlogController } from '@/blog/blog.controller';
// import { AuthMiddleware } from '@/user/middlewares/auth.middleware';
// @Module({
//   imports: [TypeOrmModule.forFeature([BlogEntity]), AuthMiddleware],
//   controllers: [BlogController],
//   providers: [BlogService],
//   exports: [],
// })
// export class UserModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL });
//   }
// }
