import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { TestimonialsModule } from 'src/modules/testimonial/testimonial.module';
import { ContactModule } from './contact/contact.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { AboutInfoModule } from './about/about.module';

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
    AboutInfoModule,
  ],
})
export class DomainModule {}
