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
import { ConsultationsModule } from 'src/modules/consultations/consultations.module';
import { PackagesModule } from 'src/modules/packages/packages.module';
import { ParentsModule } from 'src/modules/parents/parents.module';
// import { PaymentsModule } from 'src/modules/payments/payments.module';
import { TutorsModule } from 'src/modules/tutors/tutors.module';
import { BlogModule } from 'src/modules/blog/blog.module';

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
    ConsultationsModule,
    PackagesModule,
    ParentsModule,
    TutorsModule,
    BlogModule,

    // PaymentsModule,
  ],
})
export class DomainModule {}
