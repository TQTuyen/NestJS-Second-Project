import { AbstractEntity } from '@app/common';
import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@Directive('@shareable')
@ObjectType()
export class Role extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;
}
