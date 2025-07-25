import {
  IsCreditCard,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CardNetWorkDto } from './card-network.dto';
import { Type } from 'class-transformer';
import { CardMessage } from '../types';

export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  expMonth: number;

  @IsNumber()
  expYear: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardNetWorkDto)
  networks: CardNetWorkDto;

  @IsCreditCard()
  number: string;

  @IsString()
  @IsOptional()
  token: string;
}
