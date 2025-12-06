import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoManagementDto } from './dto/create-video_management.dto';
import { UpdateVideoManagementDto } from './dto/update-video_management.dto';
import { Video, VideoDocument } from './schemas/video.schema';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class VideoManagementService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createVideoManagementDto: CreateVideoManagementDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      createVideoManagementDto.videoUrl = uploadResult.url || uploadResult.path;
    }

    const createdVideo = new this.videoModel(createVideoManagementDto);
    return createdVideo.save();
  }

  async findAll() {
    return this.videoModel.find().exec();
  }

  async findOne(id: string) {
    const video = await this.videoModel.findById(id).exec();
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async update(
    id: string,
    updateVideoManagementDto: UpdateVideoManagementDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      updateVideoManagementDto.videoUrl = uploadResult.url || uploadResult.path;
    }

    const updatedVideo = await this.videoModel
      .findByIdAndUpdate(id, updateVideoManagementDto, { new: true })
      .exec();
    if (!updatedVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return updatedVideo;
  }

  async remove(id: string) {
    const deletedVideo = await this.videoModel.findByIdAndDelete(id).exec();
    if (!deletedVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return deletedVideo;
  }
}
