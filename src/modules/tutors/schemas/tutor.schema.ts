import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TutorDocument = Tutor & Document;

@Schema({ timestamps: true })
export class Tutor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User;

  @Prop([String])
  subjects: string[];

  @Prop()
  bio: string;

  @Prop([String])
  qualifications: string[];

  @Prop({ type: Object })
  availability: any; // Can be structured more specifically
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);
