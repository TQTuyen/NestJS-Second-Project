import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { catchError, map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
    private readonly logger: Logger,
  ) {}

  create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res: { id: string }) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
