import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Note } from '../note/note.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
}