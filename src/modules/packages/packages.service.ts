import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { LearningPackage, PackageDocument } from './schemas/package.schema';
import { LearningStatus } from 'src/common/enum/learning.status.enum';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(LearningPackage.name)
    private packageModel: Model<PackageDocument>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const createdPackage = new this.packageModel(createPackageDto);
    return createdPackage.save();
  }

  async findAll() {
    return this.packageModel.find().populate('parentId').exec();
  }

  async findOne(id: string) {
    const pkg = await this.packageModel
      .findById(id)
      .populate('parentId')
      .exec();
    if (!pkg) {
      throw new NotFoundException(`Package #${id} not found`);
    }
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const updatedPackage = await this.packageModel
      .findByIdAndUpdate(id, updatePackageDto, { new: true })
      .exec();

    if (!updatedPackage) {
      throw new NotFoundException(`Package #${id} not found`);
    }
    return updatedPackage;
  }

  async remove(id: string) {
    const deletedPackage = await this.packageModel.findByIdAndDelete(id).exec();
    if (!deletedPackage) {
      throw new NotFoundException(`Package #${id} not found`);
    }
    return deletedPackage;
  }

  async activatePackage(packageId: string, sessionId: string) {
    return this.packageModel.findByIdAndUpdate(
      packageId,
      {
        status: LearningStatus.ACTIVE,
        'stripe.checkoutSessionId': sessionId,
      },
      { new: true },
    );
  }
}
