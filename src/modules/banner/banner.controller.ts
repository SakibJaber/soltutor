import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user.role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createBannerDto: CreateBannerDto,
   @UploadedFile() file: Express.Multer.File) {
    return this.bannerService.create(createBannerDto, file);
  }

  @Public()
  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string,
   @Body() updateBannerDto: UpdateBannerDto,
   @UploadedFile() file: Express.Multer.File) {
    return this.bannerService.update(id, updateBannerDto, file);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
