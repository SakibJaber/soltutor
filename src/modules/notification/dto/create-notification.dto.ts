import { IsString, IsOptional, IsNotEmpty, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
