import {
  Request,
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existedUser = await this.usersService.findEmail(email);

    if (existedUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });

    const { token } = await this.usersService.setToken(newUser._id);

    return { name, email, token };
  }

  @Post('login')
  @HttpCode(200)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findEmail(email);

    if (!user) {
      throw new HttpException(
        'Email or password invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw new HttpException(
        'Email or password invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user.token) {
      const { token } = await this.usersService.setToken(user._id);

      return { name: user.name, email, token };
    }

    return { name: user.name, email, token: user.token };
  }

  @UseGuards(AuthGuard)
  @Get('current')
  @HttpCode(200)
  async getCurrent(@Request() req) {
    const { email, name } = req.user;

    const { token } = await this.usersService.findEmail(email);

    return { name, email, token };
  }
}
