import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'payments',
      noAck: false,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
