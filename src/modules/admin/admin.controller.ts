import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Role } from 'src/common/enum/user.role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    const { name, ...rest } = createAdminDto;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    return this.usersService.create(
      {
        ...rest,
        firstName,
        lastName,
        role: Role.ADMIN,
      },
      {
        sendCredentialsEmail: true,
        plainPassword: createAdminDto.password,
      },
    );
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(
      paginationDto.page ?? 1,
      paginationDto.limit ?? 10,
      Role.ADMIN,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const { name, ...rest } = updateAdminDto;
    let updateData: any = { ...rest };

    if (name) {
      const [firstName, ...lastNameParts] = name.split(' ');
      updateData.firstName = firstName;
      updateData.lastName = lastNameParts.join(' ') || '';
    }

    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
