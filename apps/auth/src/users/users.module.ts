import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerModule } from '@app/common';
import { UsersResolver } from './users.resolver';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, PrismaService],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
