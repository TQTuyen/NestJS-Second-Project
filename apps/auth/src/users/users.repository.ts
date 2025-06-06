import { AbstractRepository } from '@app/common';
import { UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from 'nestjs-pino';

export class UsersRepository extends AbstractRepository<UserDocument> {
  constructor(
    @InjectModel(UserDocument.name) userModel: Model<UserDocument>,
    protected readonly logger: Logger,
  ) {
    super(userModel);
  }
}
