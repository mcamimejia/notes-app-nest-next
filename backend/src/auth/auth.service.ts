import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string, user: number }> {
    const user = await this.userRepository.findOne({ where: { username: loginDto.username } });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user: user.id };
  }

}