import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoManagementService } from './video_management.service';
import { CreateVideoManagementDto } from './dto/create-video_management.dto';
import { UpdateVideoManagementDto } from './dto/update-video_management.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user.role.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('video')
export class VideoManagementController {
  constructor(
    private readonly videoManagementService: VideoManagementService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createVideoManagementDto: CreateVideoManagementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.videoManagementService.create(createVideoManagementDto, file);
  }

  @Public()
  @Get()
  findAll() {
    return this.videoManagementService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoManagementService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateVideoManagementDto: UpdateVideoManagementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.videoManagementService.update(
      id,
      updateVideoManagementDto,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.videoManagementService.remove(id);
  }
}
