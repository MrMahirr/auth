import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from '@/blog/blog.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  username: string;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column()
  email: string;
  @Column({ default: '' })
  bio: string;
  @Column({ default: '' })
  gender: string;
  @Column({ default: '' })
  dateofbirth: string;
  @Column({ default: '' })
  image: string;
  @Column()
  password?: string;
  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;
}
