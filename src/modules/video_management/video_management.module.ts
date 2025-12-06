import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoManagementService } from './video_management.service';
import { VideoManagementController } from './video_management.controller';
import { Video, VideoSchema } from './schemas/video.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    UploadModule,
  ],
  controllers: [VideoManagementController],
  providers: [VideoManagementService],
})
export class VideoManagementModule {}
