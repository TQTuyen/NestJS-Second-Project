import { IsEnum, IsOptional } from 'class-validator';
import { CardNetworkMessage, CardNetworkMessage_CardNetwork } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardNetWorkDto implements CardNetworkMessage {
  @IsEnum(CardNetworkMessage_CardNetwork)
  @IsOptional()
  @Field(() => CardNetworkMessage_CardNetwork, { nullable: true })
  preferred: CardNetworkMessage_CardNetwork;
}
