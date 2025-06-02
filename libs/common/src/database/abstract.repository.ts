import { NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger } from 'nestjs-pino';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found for filter: ${JSON.stringify(filterQuery)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Document was not found!!!');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const updatedDocument = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!updatedDocument) {
      this.logger.warn(
        `Document not found for update with filter: ${JSON.stringify(filterQuery)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Document was not found for update!!!');
    }

    return updatedDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const deletedDocument = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);

    if (!deletedDocument) {
      this.logger.warn(
        `Document not found for deletion with filter: ${JSON.stringify(filterQuery)}`,
        AbstractRepository.name,
      );
      throw new NotFoundException('Document was not found for deletion!!!');
    }

    return deletedDocument;
  }
}
