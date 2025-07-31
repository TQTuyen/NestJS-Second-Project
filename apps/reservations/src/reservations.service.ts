import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  CreateChargeResponse,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  User,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { catchError, map } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;

  constructor(
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    return this.paymentsService
      .createCharge({
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res: CreateChargeResponse) => {
          return this.prismaService.reservation.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              invoiceId: res.id,
              userId,
              timestamp: new Date(),
            },
          });
        }),
        catchError((error) => {
          this.logger.error(
            `Failed to create charge: ${error}`,
            ReservationsService.name,
          );
          throw new BadRequestException('Failed to create charge');
        }),
      );
  }

  async findAll() {
    return this.prismaService.reservation.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.reservation.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: {
        id,
      },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}
