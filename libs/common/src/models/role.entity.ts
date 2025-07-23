import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Role extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
