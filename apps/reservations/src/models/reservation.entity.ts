import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reservation extends AbstractEntity {
  @Field()
  timestamp: Date;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  userId: number;

  @Field()
  invoiceId: string;
}
