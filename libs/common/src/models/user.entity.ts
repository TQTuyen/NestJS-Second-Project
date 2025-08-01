import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User extends AbstractEntity {
  @Field()
  email: string;

  password: string;

  @Field(() => [String], { nullable: true })
  roles?: string[];
}
