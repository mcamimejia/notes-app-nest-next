import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Note } from './entities/note/note.entity';
import { Tag } from './entities/tag/tag.entity';
import { User } from './entities/user/user.entity';
import { NoteModule } from './entities/note/note.module';
import { TagModule } from './entities/tag/tag.module';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Note, Tag, User],
      synchronize: true,
    }),
    NoteModule,
    TagModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
