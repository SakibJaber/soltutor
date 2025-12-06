import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  videoUrl: string;
}