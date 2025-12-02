import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import {
  ConsultationRequest,
  ConsultationRequestDocument,
} from './schemas/consultation.schema';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(ConsultationRequest.name)
    private consultationModel: Model<ConsultationRequestDocument>,
  ) {}

  async create(createConsultationDto: CreateConsultationDto) {
    const createdConsultation = new this.consultationModel(
      createConsultationDto,
    );
    return createdConsultation.save();
  }

  async findAll() {
    return this.consultationModel
      .find()
      .populate('parentId')
      .populate('childIds')
      .exec();
  }

  async findOne(id: string) {
    const consultation = await this.consultationModel
      .findById(id)
      .populate('parentId')
      .populate('childIds')
      .exec();

    if (!consultation) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }
    return consultation;
  }

  async update(id: string, updateConsultationDto: UpdateConsultationDto) {
    const updatedConsultation = await this.consultationModel
      .findByIdAndUpdate(id, updateConsultationDto, { new: true })
      .exec();

    if (!updatedConsultation) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }
    return updatedConsultation;
  }

  async remove(id: string) {
    const deletedConsultation = await this.consultationModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedConsultation) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }
    return deletedConsultation;
  }
}
