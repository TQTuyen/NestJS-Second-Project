import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PAYMENTS_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: PAYMENTS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/payments.proto'),
      url: configService.getOrThrow<string>('PAYMENTS_GRPC_URL'),
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
