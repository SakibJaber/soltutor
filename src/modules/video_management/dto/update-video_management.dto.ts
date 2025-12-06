import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoManagementDto } from './create-video_management.dto';

export class UpdateVideoManagementDto extends PartialType(
  CreateVideoManagementDto,
) {}
