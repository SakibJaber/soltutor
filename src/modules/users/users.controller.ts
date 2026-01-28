import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from './schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Role } from 'src/common/enum/user.role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Only super admin can create admin users
    return await this.usersService.createAdmin(dto, {
      sendCredentialsEmail: true,
      plainPassword: dto.password,
      file,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/:id')
  async findOneAdmin(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/:id')
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('admin/:id')
  async removeAdmin(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  async findAll(@Query() query: PaginationDto) {
    const isActiveBoolean =
      query.isActive === 'true'
        ? true
        : query.isActive === 'false'
          ? false
          : undefined;

    return await this.usersService.findAll(
      query.page ?? 1,
      query.limit ?? 10,
      query.role,
      isActiveBoolean,
      query.search,
    );
  }

  @Get('me')
  async getMe(@GetUser() user: User) {
    return await user;
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @GetUser() user: User,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.updateProfile(
      user._id.toString(),
      dto,
      file,
    );
  }

  @Delete('me')
  async deleteAccount(@GetUser() user: User) {
    return await this.usersService.deleteProfile(user._id.toString());
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
