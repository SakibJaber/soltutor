import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsNotEmpty()
  @IsString()
  consultationRequestId: string;

  @IsArray()
  children: any[];

  @IsNumber()
  totalHoursPerWeek: number;

  @IsNumber()
  durationInWeeks: number;

  @IsObject()
  price: {
    amount: number;
    currency: string;
  };
}
