import { IsInt, IsNumber, IsBoolean, IsOptional, IsString, Min } from 'class-validator';

export class CreateMotherProfileDto {
  @IsInt()
  @Min(12) 
  age: number;

  @IsNumber()
  heightCm: number;

  @IsNumber()
  weightKg: number;

  @IsNumber()
  lilaCm: number; 

  @IsBoolean()
  isPregnant: boolean;

  @IsOptional()
  @IsInt()
  trimester?: number;

  @IsOptional()
  @IsString()
  ttdCompliance?: string;
}