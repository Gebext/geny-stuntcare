import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
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

export class ChildFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['L', 'P'])
  gender?: string;

  @IsOptional()
  @IsString()
  stuntingRisk?: string; // Sesuai enum di database Anda (misal: LOW, MEDIUM, HIGH)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
