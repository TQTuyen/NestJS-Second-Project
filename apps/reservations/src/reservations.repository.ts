import { AbstractRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ReservationDocument } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>,
    protected readonly logger: Logger,
  ) {
    super(reservationModel);
  }
}
