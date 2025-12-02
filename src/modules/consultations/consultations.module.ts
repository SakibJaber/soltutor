import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import {
  ConsultationRequest,
  ConsultationSchema,
} from './schemas/consultation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsultationRequest.name, schema: ConsultationSchema },
    ]),
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
