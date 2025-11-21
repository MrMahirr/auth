import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '@/tag/tag.entity';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsReository: Repository<TagEntity>,
  ) {}
  async getAll() {
    return await this.tagsReository.find();
  }
}
