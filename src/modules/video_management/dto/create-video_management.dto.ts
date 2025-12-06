import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateVideoManagementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}
