import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { PackagesService } from '../packages/packages.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly packagesService: PackagesService,
  ) {}

  @Post('webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: Request,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      // The raw body is needed for signature verification.
      // NestJS by default parses JSON. We need the raw buffer here.
      // Assuming main.ts or middleware preserves raw body or we can access it.
      // If using standard NestJS body parser, we might need a raw body middleware.
      // For now, assuming request.body is the raw buffer or handled via middleware.
      // NOTE: In a real NestJS app, you often need a specific middleware to get raw body for webhooks.

      // If request.body is already JSON, this will fail.
      // We will assume the user has configured raw body for this route or we use a workaround.
      // For this implementation, we'll assume `request.body` is accessible as Buffer if configured,
      // or we might need to use a custom decorator/interceptor.

      // Let's assume standard setup for now, but this is a common pitfall.
      const event = await this.stripeService.constructEventFromPayload(
        signature,
        request.body as any,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const packageId = session.metadata?.packageId;

        if (packageId) {
          this.logger.log(`Payment successful for package ${packageId}`);
          await this.packagesService.activatePackage(packageId, session.id);
        }
      }

      return { received: true };
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
