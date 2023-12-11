import * as Joi from 'joi';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(255),
});
