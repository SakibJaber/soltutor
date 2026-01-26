import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'handlebars';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject('MAIL_TRANSPORTER') private transporter: Transporter,
    private config: ConfigService,
  ) {
    this.logger.log('MailService initialized');

    // Log transporter events
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error verifying mail transporter:', error);
      } else {
        this.logger.log('Mail transporter is ready to take our messages');
      }
    });
  }

  private compileTemplate(templateName: string, context: any) {
    const templatePath = path.join(
      process.cwd(),
      'src/modules/mail/templates',
      `${templateName}.hbs`,
    );

    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const template = hbs.compile(templateFile);

    return template(context);
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    template?: string;
    context?: any;
    html?: string;
  }) {
    const html = options.template
      ? this.compileTemplate(options.template, options.context)
      : options.html;

    return this.transporter.sendMail({
      to: options.to,
      subject: options.subject,
      html,
      from: this.config.get('mail.from'),
    });
  }

  async sendOtpEmail(email: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'Your OTP Code',
      template: 'otp',
      context: { otp },
    });
  }

  async sendUserCredentialsEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    return this.sendEmail({
      to: email,
      subject: 'Your Account Credentials - SQL Tutor',
      template: 'user-credentials',
      context: { email, password, firstName, lastName },
    });
  }

  async sendTuitionRequestCreatedEmail(
    email: string,
    parentName: string,
    childName: string,
    subject: string,
    tutorName: string,
    fees: number,
    dashboardUrl: string,
  ) {
    return this.sendEmail({
      to: email,
      subject: 'New Tuition Request - SQL Tutor',
      template: 'tuition-request-created',
      context: {
        parentName,
        childName,
        subject,
        tutorName,
        fees,
        dashboardUrl,
      },
    });
  }

  async sendTuitionRequestRejectedEmail(
    email: string,
    childName: string,
    reason: string,
  ) {
    return this.sendEmail({
      to: email,
      subject: 'Tuition Request Rejected - SQL Tutor',
      template: 'tuition-request-rejected',
      context: { childName, reason },
    });
  }

  async sendTuitionRequestPaidEmail(
    email: string,
    childName: string,
    amount: number,
    transactionId: string,
  ) {
    return this.sendEmail({
      to: email,
      subject: 'Tuition Request Paid - SQL Tutor',
      template: 'tuition-request-paid',
      context: { childName, amount, transactionId },
    });
  }
}
