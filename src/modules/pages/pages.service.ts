import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from './schemas/page.schema';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<PageDocument>) {}

  async get(type: string): Promise<Page | null> {
    const page = await this.pageModel.findOne({ type }).exec();
    return page;
  }

  async update(type: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.pageModel
      .findOneAndUpdate(
        { type },
        { ...updatePageDto, type }, // Ensure type is set on upsert
        { new: true, upsert: true },
      )
      .exec();
    return page;
  }
}
