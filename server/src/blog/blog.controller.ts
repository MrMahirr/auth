import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.services';
import { CreateBlogDto } from './dto/createBlog.dto';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UpdateBlogDto } from '@/blog/dto/updateBlog.dto';
import { User } from '@/user/decorators/user.decorator';
import * as userType from '@/user/types/user.type';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('')
  @UseGuards(AuthGuard)
  create(@User() user: userType.IUser, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(user, createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
