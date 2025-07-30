import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CardNetWorkDto } from './card-network.dto';
import { Type } from 'class-transformer';
import { CardMessage } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  @Field()
  cvc: string;

  @IsNumber()
  @Field()
  expMonth: number;

  @IsNumber()
  @Field()
  expYear: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CardNetWorkDto)
  @Field(() => CardNetWorkDto, { nullable: true })
  networks: CardNetWorkDto;

  @IsCreditCard()
  @Field()
  number: string;

  @IsString()
  @IsOptional()
  @Field()
  token: string;
}
