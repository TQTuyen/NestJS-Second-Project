import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Logger } from 'nestjs-pino';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-05-28.basil',
        typescript: true,
        appInfo: {
          name: 'nestjs-payments',
          version: '1.0.0',
        },
      },
    );
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: card.token,
        },
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: amount * 100,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        currency: 'usd',
      });

      this.notificationsService.emit('notify_email', {
        email,
        subject: 'Payment Successful - Sleepr',
        text: `Your payment of $${amount} was successful! Thank you for using Sleepr.`,
        amount,
        transactionId: paymentIntent.id,
        date: new Date().toISOString(),
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error creating charge:: ${error}`,
        PaymentsService.name,
      );
      throw new UnprocessableEntityException(error);
    }
  }

  async getPayments() {
    const payments = await this.stripe.paymentIntents.list();
    return payments.data;
  }
}
