// import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
// import { BlogService } from './blog.services';
// import { CreateBlogDto } from './dto/createBlog.dto';
// // import { AuthGuard } from '../user/guards/auth.guard'; // Kendi AuthGuard yolunu yaz
//
// @Controller('blogs')
// export class BlogController {
//   constructor(private readonly blogService: BlogService) {}
//
//   @Post()
//   @UseGuards(AuthGuard) // Sadece giriş yapmış kullanıcılar blog ekleyebilir
//   create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
//     // req.user, AuthGuard'dan gelen kullanıcı bilgisidir
//     return this.blogService.create(req.user, createBlogDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.blogService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.blogService.findOne(+id);
//   }
//
//   @Put(':id')
//   @UseGuards(AuthGuard)
//   update(@Param('id') id: string, @Body() updateBlogDto: CreateBlogDto) {
//     return this.blogService.update(+id, updateBlogDto);
//   }
//
//   @Delete(':id')
//   @UseGuards(AuthGuard)
//   remove(@Param('id') id: string) {
//     return this.blogService.remove(+id);
//   }
// }
