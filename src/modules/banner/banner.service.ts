import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UploadService } from 'src/modules/upload/upload.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createBannerDto: CreateBannerDto,
    file: Express.Multer.File): Promise<Banner> {
  
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      createBannerDto.videoUrl = uploadResult.url || uploadResult.path;
    }
    const createdBanner = new this.bannerModel(createBannerDto);
    return createdBanner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto,
    file: Express.Multer.File
  ): Promise<Banner> {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      updateBannerDto.videoUrl = uploadResult.url || uploadResult.path;
    }
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, updateBannerDto, { new: true })
      .exec();
    if (!updatedBanner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return updatedBanner;
  }

  async remove(id: string): Promise<Banner> {
    const deletedBanner = await this.bannerModel.findByIdAndDelete(id).exec();
    if (!deletedBanner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return deletedBanner;
  }
}
