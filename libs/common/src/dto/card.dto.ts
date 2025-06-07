import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CardNetWorkDto } from './card-network.dto';

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
  networks: CardNetWorkDto;

  @IsNumber()
  @IsNotEmpty()
  number: string;

  @IsString()
  token: string;
}
