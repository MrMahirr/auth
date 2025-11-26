import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BlogEntity } from '../blog/blog.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column({ default: '' })
  bio: string;
  @Column({ default: '' })
  image: string;
  @Column()
  password?: string;
  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
