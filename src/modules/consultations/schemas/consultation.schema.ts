import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConsultationStatus } from 'src/common/enum/consultation.status.enum';

export type ConsultationRequestDocument = ConsultationRequest & Document;

@Schema({ timestamps: true })
export class ConsultationRequest {
  @Prop({ type: Types.ObjectId, ref: 'Parent' })
  parentId: string;

  @Prop({ type: [Types.ObjectId], ref: 'Child' })
  childIds: string[];

  @Prop([String])
  preferredSubjects: string[];

  @Prop({ type: String })
  goals: string;

  @Prop({
    type: String,
    enum: ConsultationStatus,
    default: ConsultationStatus.PENDING_REVIEW,
  })
  status: string;

  @Prop({
    type: Object,
    default: {},
  })
  meeting: {
    meetingUrl?: string;
    scheduledAt?: Date;
  };
}

export const ConsultationSchema =
  SchemaFactory.createForClass(ConsultationRequest);
