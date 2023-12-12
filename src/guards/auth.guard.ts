import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const [bearer, token] = authorization?.split(' ') ?? [];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      const { _id } = await this.jwtService.verifyAsync(token);
      const user = await this.userModel.findById(_id);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
