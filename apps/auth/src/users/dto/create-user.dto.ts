import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @IsEmail()
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String])
  roles: string[];
}
