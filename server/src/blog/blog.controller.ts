import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
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
  @UseGuards(AuthGuard('jwt'))
  async create(
    @User() user: userType.IUser,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    try {
      return await this.blogService.create(user, createBlogDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[BlogController.create] Blog oluşturma hatası:', {
          message: error.message,
          title: createBlogDto.title,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogController.create] Bilinmeyen hata:', {
          raw: error,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Blog oluşturulurken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.blogService.findAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[BlogController.findAll] Blog listesi hatası:', {
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogController.findAll] Bilinmeyen hata:', {
          raw: error,
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Bloglar getirilirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.blogService.findOne(+id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[BlogController.findOne] Blog getirme hatası:', {
          message: error.message,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogController.findOne] Bilinmeyen hata:', {
          raw: error,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Blog getirilirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    try {
      return await this.blogService.update(+id, updateBlogDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[BlogController.update] Blog güncelleme hatası:', {
          message: error.message,
          blogId: id,
          updateFields: Object.keys(updateBlogDto),
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogController.update] Bilinmeyen hata:', {
          raw: error,
          blogId: id,
          updateFields: Object.keys(updateBlogDto),
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Blog güncellenirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    try {
      return await this.blogService.remove(+id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[BlogController.remove] Blog silme hatası:', {
          message: error.message,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogController.remove] Bilinmeyen hata:', {
          raw: error,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Blog silinirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
