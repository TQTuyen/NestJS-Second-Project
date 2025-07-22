import { AbstractRepository, User } from '@app/common';
import { Logger } from 'nestjs-pino';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

export class UsersRepository extends AbstractRepository<User> {
  constructor(
    @InjectRepository(User) usersRepository: Repository<User>,
    @InjectEntityManager() entityManager: EntityManager,
    protected readonly logger: Logger,
  ) {
    super(usersRepository, entityManager);
  }
}
