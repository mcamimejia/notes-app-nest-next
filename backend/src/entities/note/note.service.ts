import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { Note } from './note.entity';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.noteRepository.find({ relations: ['tags', 'user'] });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id }, relations: ['tags', 'user'] });
    if (!note) {
      throw new HttpException(`Note with ID ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { userId, tags, ...noteData } = createNoteDto;

    const user = await this.userRepository.findOne({ where: { id: userId }});

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const tagEntities = await this.tagRepository.find({where: {id: In(tags)}});

    const note = this.noteRepository.create({ ...noteData, user, tags: tagEntities });

    return this.noteRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<any> {
    const { userId, tags, ...updateData } = updateNoteDto;

    const note = await this.findOne(id);

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      note.user = user;
    }

    if (tags) {
      const tagEntities = await this.tagRepository.find({where: { id: In(tags) }});
      note.tags = tagEntities;
    }

    Object.assign(note, updateData);

    return this.noteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.noteRepository.remove(note);
  }
}