import {
  BeforeInsert,
  Column,
  Entity,
  Index,
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

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  surname?: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dateofbirth?: Date;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 'local' })
  provider: 'local' | 'google';

  @Column({ nullable: true })
  googleId?: string;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  /* 🔐 SADECE INSERT'TE HASH */
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
