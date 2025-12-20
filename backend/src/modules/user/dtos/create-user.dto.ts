import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name:string;

  @IsEmail()
  @IsNotEmpty()
  readonly email:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password:string;

  @IsString()
  @IsOptional()
  readonly phone?:string;
}
