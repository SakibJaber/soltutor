import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTestimonialDto {
  @IsString()
  quote: string;

  @IsString()
  authorName: string;

  @IsString()
  authorTitle: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const val = value.trim().toLowerCase();
      if (val === 'true') return true;
      if (val === 'false') return false;
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  authorAvatar?: string;
}
