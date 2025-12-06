import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PageType } from 'src/common/enum/pagetype.enum';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true, unique: true, enum: PageType })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PageSchema = SchemaFactory.createForClass(Page);
