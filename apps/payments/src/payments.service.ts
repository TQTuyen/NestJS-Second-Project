import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
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

  async createCharge({ card, amount }: CreateChargeDto) {
    try {
      this.logger.log(
        `Creating charge with:: ${card.token} for amount:: ${amount}`,
        PaymentsService.name,
      );

      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: card.token,
        },
      });

      this.logger.log(
        `Payment method created:: ${paymentMethod.id}`,
        PaymentsService.name,
      );

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

      this.logger.log(
        `Payment intent created:: ${paymentIntent.amount}`,
        PaymentsService.name,
      );

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error creating charge:: ${error}`,
        PaymentsService.name,
      );
      throw new UnprocessableEntityException(error);
    }
  }
}
