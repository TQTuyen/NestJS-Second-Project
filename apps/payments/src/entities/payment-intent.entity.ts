import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentIntent {
  @Field()
  id: string;

  @Field()
  currency: string;

  @Field()
  amount: number;

  @Field({ nullable: true })
  customer: string;
}
