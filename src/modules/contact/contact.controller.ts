import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateBusinessInfoDto } from './dto/update-business-info.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user.role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    const result = await this.contactService.createContact(createContactDto);
    return {
      message: 'Message sent successfully',
      data: result,
    };
  }

  @Get('messages')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllContacts() {
    return this.contactService.getAllContacts();
  }

  @Get('messages/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getContactById(@Param('id') id: string) {
    return this.contactService.getContactById(id);
  }

  @Patch('messages/:id/read')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete('messages/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }

  @Public()
  @Get('business-info')
  getBusinessInfo() {
    return this.contactService.getBusinessInfo();
  }

  @Patch('business-info')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBusinessInfo(@Body() updateBusinessInfoDto: UpdateBusinessInfoDto) {
    return this.contactService.updateBusinessInfo(updateBusinessInfoDto);
  }
}
