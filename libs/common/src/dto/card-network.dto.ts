import { IsEnum, IsOptional } from 'class-validator';

enum CardNetWork {
  CARTES_BANCAIRES = 'cartes_bancaires',
  MASTERCARD = 'mastercard',
  VISA = 'visa',
}

export class CardNetWorkDto {
  @IsEnum(CardNetWork)
  @IsOptional()
  preferred: CardNetWork;
}
