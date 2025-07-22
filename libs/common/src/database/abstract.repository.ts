import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { Logger } from 'nestjs-pino';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected readonly logger: Logger;

  constructor(
    protected readonly entityRepository: Repository<T>,
    protected readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return await this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn(
        `Entity not found for where: ${JSON.stringify(where)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Entity was not found!!!');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn(
        `Entity not found for update with where: ${JSON.stringify(where)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Entity was not found for update!!!');
    }

    return await this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return await this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<number> {
    const deleteResult = await this.entityRepository.delete(where);

    if (!deleteResult.affected) {
      this.logger.warn(
        `Entity not found for deletion with where: ${JSON.stringify(where)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Entity was not found for deletion!!!');
    }

    return deleteResult.affected;
  }
}
