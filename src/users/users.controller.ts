import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existedUser = await this.usersService.findOneByEmail(email);

    if (existedUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const { _id } = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });

    const { token } = await this.usersService.findByIdAndSetToken(_id);

    return { name, email, token };
  }
}
