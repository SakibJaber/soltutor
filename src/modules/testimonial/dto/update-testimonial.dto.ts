import { PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonial.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {
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
}
