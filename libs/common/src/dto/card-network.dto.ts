import { IsEnum, IsOptional } from 'class-validator';
import { CardNetworkMessage, CardNetworkMessage_CardNetwork } from '../types';

export class CardNetWorkDto implements CardNetworkMessage {
  @IsEnum(CardNetworkMessage_CardNetwork)
  @IsOptional()
  preferred: CardNetworkMessage_CardNetwork;
}
