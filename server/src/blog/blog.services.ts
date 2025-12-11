import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from '@/blog/dto/updateBlog.dto';
import { IUser } from '@/user/types/user.type';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async create(
    currentUser: IUser,
    createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    try {
      if (!currentUser) {
        console.error('[BlogService.create] Author eksik');
        throw new HttpException(
          'Blog oluşturmak için giriş yapmış olmanız gerekiyor',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const newBlog = this.blogRepository.create({
        ...createBlogDto,
        author: currentUser,
      });

      return await this.blogRepository.save(newBlog);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[BlogService.create] Blog oluşturma hatası:', {
          message: err.message,
          title: createBlogDto.title,
          userId: currentUser?.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogService.create] Bilinmeyen hata:', {
          raw: err,
          title: createBlogDto.title,
          userId: currentUser?.id,
          timestamp: new Date().toISOString(),
        });
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Blog veritabanına kaydedilirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<BlogEntity[]> {
    try {
      return await this.blogRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[BlogService.findAll] Blog listesi hatası:', {
          message: err.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogService.findAll] Bilinmeyen hata:', {
          raw: err,
          timestamp: new Date().toISOString(),
        });
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Bloglar veritabanından çekilirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<BlogEntity> {
    try {
      const blog = await this.blogRepository.findOne({ where: { id } });

      if (!blog) {
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
      }

      return blog;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[BlogService.findOne] Blog bulunamadı:', {
          message: err.message,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogService.findOne] Bilinmeyen hata:', {
          raw: err,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Blog aranırken bir veritabanı hatası oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
    try {
      const blog = await this.findOne(id);

      Object.assign(blog, updateBlogDto);

      return await this.blogRepository.save(blog);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[BlogService.update] Blog güncelleme hatası:', {
          message: err.message,
          blogId: id,
          updateFields: Object.keys(updateBlogDto),
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogService.update] Bilinmeyen hata:', {
          raw: err,
          blogId: id,
          updateFields: Object.keys(updateBlogDto),
          timestamp: new Date().toISOString(),
        });
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Blog güncellenirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    try {
      const blog = await this.findOne(id);

      await this.blogRepository.remove(blog);

      return { deleted: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[BlogService.remove] Blog silme hatası:', {
          message: err.message,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('[BlogService.remove] Bilinmeyen hata:', {
          raw: err,
          blogId: id,
          timestamp: new Date().toISOString(),
        });
      }

      if (err instanceof HttpException) {
        throw err;
      }

      // Eğer PostgreSQL hata kodu varsa → unknown olduğu için önce type guard gerekiyor
      const pgError = err as { code?: string };

      if (pgError.code === '23503') {
        throw new HttpException(
          'Blog silinemedi: İlişkili kayıtlar mevcut',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'Blog silinirken bir veritabanı hatası oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
