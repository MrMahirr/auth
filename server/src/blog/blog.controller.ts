import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogService } from './blog.services';
import { CreateBlogDto } from './dto/createBlog.dto';
import { AuthGuard } from '@/user/guards/auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('')
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
    // Create a new blog post
    return this.blogService.create(req.user, createBlogDto);
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
  update(@Param('id') id: string, @Body() updateBlogDto: CreateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
