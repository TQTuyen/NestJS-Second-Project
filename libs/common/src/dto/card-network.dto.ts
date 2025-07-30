import { IsEnum, IsOptional } from 'class-validator';
import { CardNetworkMessage, CardNetworkMessage_CardNetwork } from '../types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

// Register the enum with GraphQL
registerEnumType(CardNetworkMessage_CardNetwork, {
  name: 'CardNetwork',
  description: 'Supported card networks',
});

@InputType()
export class CardNetWorkDto implements CardNetworkMessage {
  @IsEnum(CardNetworkMessage_CardNetwork)
  @IsOptional()
  @Field(() => CardNetworkMessage_CardNetwork, { nullable: true })
  preferred: CardNetworkMessage_CardNetwork;
}
