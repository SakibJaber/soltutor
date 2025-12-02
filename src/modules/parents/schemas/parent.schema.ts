import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Child' }] })
  children: Types.ObjectId[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
