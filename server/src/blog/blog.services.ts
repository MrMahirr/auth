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
    currentUser: IUser | undefined,
    createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    const newBlog = this.blogRepository.create({
      ...createBlogDto,
      author: currentUser || undefined,
    });
    return await this.blogRepository.save(newBlog);
  }

  async findAll(): Promise<BlogEntity[]> {
    return await this.blogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
    const blog = await this.findOne(id);
    Object.assign(blog, updateBlogDto);
    return await this.blogRepository.save(blog);
  }

  async remove(id: number): Promise<any> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
    return { deleted: true };
  }
}
