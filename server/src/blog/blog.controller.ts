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
import { UpdateBlogDto } from '@/blog/dto/updateBlog.dto';
import { User } from '@/user/decorators/user.decorator';
import * as userType from '@/user/types/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('')
  create(
    @User() user: userType.IUser | undefined,
    @Body() createBlogDto: CreateBlogDto,
  ) {
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
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
