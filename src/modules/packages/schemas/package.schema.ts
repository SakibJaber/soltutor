import { Document, Types, } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LearningStatus } from 'src/common/enum/learning.status.enum';

export type PackageDocument = LearningPackage & Document;
@Schema({ timestamps: true })
export class LearningPackage {
  @Prop({ type:Types.ObjectId, ref: 'Parent' })
  parentId: string;

  @Prop({ type: Types.ObjectId, ref: 'ConsultationRequest' })
  consultationRequestId: string;

  @Prop({
    type: [
      {
        childId: { type: Types.ObjectId, ref: 'Child' },
        subjects: [String],
        hoursPerWeek: Number,
      },
    ],
  })
  children: Array<any>;

  @Prop(Number)
  totalHoursPerWeek: number;

  @Prop(Number)
  durationInWeeks: number;

  @Prop({
    type: String,
    enum: LearningStatus,
    default: LearningStatus.DRAFT,
  })
  status: string;

  @Prop({
    type: Object,
    default: {},
  })
  stripe: {
    checkoutSessionId?: string;
    paymentIntentId?: string;
    customerId?: string;
  };

  @Prop({
    type: Object,
  })
  price: {
    amount: number;
    currency: string;
  };
}

export const PackageSchema = SchemaFactory.createForClass(LearningPackage);
