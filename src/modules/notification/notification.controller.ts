import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';
import { Role } from '../../common/enum/user.role.enum';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser() user: User,
  ) {
    let targetUserId = createNotificationDto.userId;

    // If user is not admin, they can only create notifications for themselves
    if (!targetUserId || user.role !== Role.ADMIN) {
      targetUserId = user._id.toString();
    }

    if (!targetUserId) {
      throw new BadRequestException('userId is required');
    }

    return this.notificationService.createNotification({
      title: createNotificationDto.title,
      body: createNotificationDto.body,
      metadata: createNotificationDto.metadata || {},
      user: targetUserId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@GetUser() user: User) {
    return this.notificationService.getUserNotifications(user._id.toString());
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string, @GetUser() user: User) {
    const notification = await this.notificationService.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        "Can't mark notifications that aren't yours",
      );
    }
    return this.notificationService.markAsRead(id);
  }
}
