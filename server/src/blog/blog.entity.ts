// import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { UserEntity } from '../user/user.entity'; // User entity yolunu kontrol et
//
// @Entity('blogs')
// export class BlogEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   title: string;
//
//   @Column('text')
//   content: string;
//
//   @Column({ nullable: true })
//   image: string;
//
//   @Column()
//   category: string;
//
//   @CreateDateColumn()
//   createdAt: Date;
//
//   @UpdateDateColumn()
//   updatedAt: Date;
//
//   // Blogun bir yazarı olur
//   @ManyToOne(() => UserEntity, (user) => user.blogs, { eager: true })
//   author: UserEntity;
// }