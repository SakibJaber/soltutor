import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async create(dto: CreateTestimonialDto, file?: Express.Multer.File) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      dto.authorAvatar = uploadResult.url || uploadResult.path;
    }
    return await this.testimonialModel.create(dto);
  }

  async findAll(page = 1, limit = 20, isActive?: boolean) {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const items = await this.testimonialModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.testimonialModel.countDocuments(query);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    id: string,
    dto: UpdateTestimonialDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      dto.authorAvatar = uploadResult.url || uploadResult.path;
    }
    const updated = await this.testimonialModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Testimonial not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.testimonialModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Testimonial not found');
    return { deleted: true };
  }
}
