import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
