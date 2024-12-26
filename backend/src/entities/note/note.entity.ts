import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  isArchived: boolean;

  @ManyToMany(() => Tag, (tag) => tag.notes)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.notes)
  user: User;
}