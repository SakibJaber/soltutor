import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @IsOptional()
  @IsObject()
  meeting?: {
    meetingUrl?: string;
    scheduledAt?: Date;
  };
}
