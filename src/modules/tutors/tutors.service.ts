import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor, TutorDocument } from './schemas/tutor.schema';

@Injectable()
export class TutorsService {
  constructor(
    @InjectModel(Tutor.name)
    private tutorModel: Model<TutorDocument>,
  ) {}

  async create(createTutorDto: CreateTutorDto) {
    const createdTutor = new this.tutorModel({
      ...createTutorDto,
      user: createTutorDto.userId,
    });
    return createdTutor.save();
  }

  async findAll() {
    return this.tutorModel.find().populate('user').exec();
  }

  async findOne(id: string) {
    const tutor = await this.tutorModel.findById(id).populate('user').exec();
    if (!tutor) {
      throw new NotFoundException(`Tutor #${id} not found`);
    }
    return tutor;
  }

  async update(id: string, updateTutorDto: UpdateTutorDto) {
    const updatedTutor = await this.tutorModel
      .findByIdAndUpdate(id, updateTutorDto, { new: true })
      .exec();

    if (!updatedTutor) {
      throw new NotFoundException(`Tutor #${id} not found`);
    }
    return updatedTutor;
  }

  async remove(id: string) {
    const deletedTutor = await this.tutorModel.findByIdAndDelete(id).exec();
    if (!deletedTutor) {
      throw new NotFoundException(`Tutor #${id} not found`);
    }
    return deletedTutor;
  }
}
