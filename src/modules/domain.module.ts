import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { TestimonialsModule } from 'src/modules/testimonial/testimonial.module';
import { ContactModule } from './contact/contact.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { BlogModule } from 'src/modules/blog/blog.module';
import { VideoManagementModule } from './video_management/video_management.module';
import { FaqModule } from './faq/faq.module';
import { PagesModule } from './pages/pages.module';
import { BannerModule } from './banner/banner.module';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    UploadModule,
    MailModule,
    TestimonialsModule,
    ContactModule,
    ContactInfoModule,
    BlogModule,
    VideoManagementModule,
    FaqModule,
    PagesModule,
    BannerModule,
    NotificationModule,
  ],
})
export class DomainModule {}
