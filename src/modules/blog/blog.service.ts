import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createBlogDto: CreateBlogDto, file?: Express.Multer.File) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      createBlogDto.image = uploadResult.url || uploadResult.path;
    }
    const blog = await this.blogModel.create(createBlogDto);
    return blog;
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Search in title and content using regex
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await this.blogModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.blogModel.countDocuments(query);

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

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult: any = await this.uploadService.upload(file);
      updateBlogDto.image = uploadResult.url || uploadResult.path;
    }

    const blog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {
      new: true,
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id);

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return { deleted: true, id };
  }
}
