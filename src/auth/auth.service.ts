import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create({
      _id: new Types.ObjectId(),
      ...createUserDto,
    });
    return createdUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user || null;
  }

  async findById(_id: string): Promise<User | null> {
    const user = await this.userModel.findById(_id);
    return user || null;
  }

  async setToken(_id: Types.ObjectId): Promise<User> {
    const token = await this.jwtService.signAsync({ _id });
    const user = await this.userModel.findByIdAndUpdate(_id, { token });
    return { ...user, token };
  }

  async removeToken(_id: Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(_id, { token: '' });
  }
}
