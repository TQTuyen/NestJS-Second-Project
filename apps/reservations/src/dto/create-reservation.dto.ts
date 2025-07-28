import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationDto {
  // swagger decorators are used to document the API
  @ApiProperty({
    description: 'The date and time when the reservation starts',
    type: String,
    format: 'date-time',
    example: '2024-10-01T12:00:00Z',
  })
  // class-validator decorators are used to validate the input
  @IsDate()
  @Type(() => Date) // ensures that the date is transformed correctly
  @Field()
  startDate: Date;

  @ApiProperty({
    description: 'The date and time when the reservation ends',
    type: String,
    format: 'date-time',
    example: '2024-10-01T14:00:00Z',
  })
  @IsDate()
  @Type(() => Date) // ensures that the date is transformed correctly
  @Field()
  endDate: Date;

  @ApiProperty({
    description: 'The charge details for the reservation',
    type: CreateChargeDto,
  })
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}
