import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
