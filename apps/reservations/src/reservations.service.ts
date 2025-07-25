import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import {
  CreateChargeResponse,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  User,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { catchError, map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;

  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
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
          const reservation = Reservation.create({
            ...createReservationDto,
            invoiceId: res.id,
            userId,
            timestamp: new Date(),
          });
          return this.reservationsRepository.create(reservation);
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
    return this.reservationsRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationsRepository.findOne({
      id,
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({
      id,
    });
  }
}
