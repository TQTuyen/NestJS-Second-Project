import { Field, ObjectType } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

@ObjectType({ isAbstract: true })
export class AbstractEntity {
  @Field()
  id: number;

  static create<T>(this: new (...args: any[]) => T, data: Partial<T>): T {
    return plainToInstance(this, data);
  }
}
