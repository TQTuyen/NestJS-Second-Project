import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  // use global logger
  app.useLogger(app.get(Logger));

  // use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that are not decorated with @IsDefined, @IsString, etc.
      transform: true, // automatically transform payloads to DTO instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Tài liệu')
    .setDescription('Tài liệu API tự động tạo bởi Swagger')
    .setVersion('1.0')
    .addTag('reservations') // thẻ dùng để nhóm các route
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api là đường dẫn tài liệu

  await app.listen(process.env.port ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
