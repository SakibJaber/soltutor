import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTutorDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @IsOptional()
  @IsObject()
  availability?: any;
}
