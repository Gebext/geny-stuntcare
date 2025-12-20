import {
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export class CreateChildDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['L', 'P'], {
    message: 'Gender must be L (Laki-laki) or P (Perempuan)',
  })
  gender: string;

  @IsDateString()
  birthDate: string;

  @IsNumber()
  birthWeight: number;

  @IsNumber()
  birthLength: number;

  @IsBoolean()
  asiExclusive: boolean;
}
