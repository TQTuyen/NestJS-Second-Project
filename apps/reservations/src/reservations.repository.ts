import { AbstractRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Reservation } from './models/reservation.entity';
import { Logger } from 'nestjs-pino';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  constructor(
    @InjectRepository(Reservation)
    protected readonly reservationsRepository: Repository<Reservation>,
    @InjectEntityManager() protected readonly entityManager: EntityManager,
    protected readonly logger: Logger,
  ) {
    super(reservationsRepository, entityManager);
  }
}
