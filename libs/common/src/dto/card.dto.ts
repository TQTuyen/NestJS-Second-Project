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

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

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
