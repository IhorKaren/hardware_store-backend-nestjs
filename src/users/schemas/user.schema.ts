import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: [true, 'Email is required'], unique: true })
  email: number;

  @Prop({ required: [true, 'Set password for user'] })
  password: number;

  @Prop({ required: true })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
