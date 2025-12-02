import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { Parent, ParentSchema } from './schemas/parent.schema';
import { Child, ChildSchema } from './schemas/child.schema';
import {
  LearningPackage,
  PackageSchema,
} from '../packages/schemas/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parent.name, schema: ParentSchema },
      { name: Child.name, schema: ChildSchema },
      { name: LearningPackage.name, schema: PackageSchema },
    ]),
  ],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService, MongooseModule],
})
export class ParentsModule {}
