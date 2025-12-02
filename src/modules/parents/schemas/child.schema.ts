import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChildDocument = Child & Document;

@Schema({ timestamps: true })
export class Child {
  @Prop({ type: Types.ObjectId, ref: 'Parent', required: true })
  parentId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  grade: string;

  @Prop([String])
  subjectsOfInterest: string[];
}

export const ChildSchema = SchemaFactory.createForClass(Child);
