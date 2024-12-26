import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule, TagModule],
  providers: [NoteService],
  controllers: [NoteController],
})

export class NoteModule {}