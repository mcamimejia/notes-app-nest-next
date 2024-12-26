import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './tag.dto';
import { UpdateTagDto } from './tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['notes'] });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({where: { id }, relations: ['notes']});
    if (!tag) {
        throw new HttpException(`Tag with ID ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    return tag;
  }

  create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<any> {
    const { name } = updateTagDto;
    const tag = await this.findOne(id);

    if (name !== undefined) {
        tag.name = name;
    }

    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}