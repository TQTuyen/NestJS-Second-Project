import { Field, ObjectType } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
export class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  static create<T>(this: new (...args: any[]) => T, data: Partial<T>): T {
    return plainToInstance(this, data);
  }
}
