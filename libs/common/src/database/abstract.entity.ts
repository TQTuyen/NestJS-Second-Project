import { plainToInstance } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  static create<T>(this: new (...args: any[]) => T, data: Partial<T>): T {
    return plainToInstance(this, data);
  }
}
