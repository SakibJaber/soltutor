import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent, ParentDocument } from './schemas/parent.schema';
import { Child, ChildDocument } from './schemas/child.schema';

@Injectable()
export class ParentsService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
  ) {}

  async create(createParentDto: CreateParentDto) {
    const { children, userId, ...parentData } = createParentDto;

    // Create Parent
    const parent = new this.parentModel({
      user: userId,
      ...parentData,
    });
    await parent.save();

    // Create Children
    if (children && children.length > 0) {
      const childDocs = children.map((child) => ({
        ...child,
        parentId: parent._id,
      }));
      const savedChildren = await this.childModel.insertMany(childDocs);

      // Link children to parent
      parent.children = savedChildren.map((c) => c._id as Types.ObjectId);
      await parent.save();
    }

    return this.findOne(parent._id.toString());
  }

  async findAll() {
    return this.parentModel.find().populate('user').populate('children').exec();
  }

  async findOne(id: string) {
    const parent = await this.parentModel
      .findById(id)
      .populate('user')
      .populate('children')
      .exec();

    if (!parent) {
      throw new NotFoundException(`Parent #${id} not found`);
    }
    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    const parent = await this.parentModel
      .findByIdAndUpdate(id, updateParentDto, { new: true })
      .exec();

    if (!parent) {
      throw new NotFoundException(`Parent #${id} not found`);
    }
    return parent;
  }

  async remove(id: string) {
    const parent = await this.parentModel.findById(id).exec();
    if (!parent) {
      throw new NotFoundException(`Parent #${id} not found`);
    }

    // Delete associated children
    await this.childModel.deleteMany({ parentId: id }).exec();

    return this.parentModel.findByIdAndDelete(id).exec();
  }
}
