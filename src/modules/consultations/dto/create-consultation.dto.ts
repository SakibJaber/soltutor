import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsArray()
  @IsString({ each: true })
  childIds: string[];

  @IsArray()
  @IsString({ each: true })
  preferredSubjects: string[];

  @IsNotEmpty()
  @IsString()
  goals: string;

  @IsOptional()
  @IsString()
  status?: string;
}
