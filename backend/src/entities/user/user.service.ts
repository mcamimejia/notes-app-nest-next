import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['notes'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['notes', 'notes.tags'] });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new HttpException('Username is already used', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({username, password: hashedPassword});
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const { username, password } = updateUserDto;
    const user = await this.findOne(id);

    if (username) {
        user.username = username;
    }

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}