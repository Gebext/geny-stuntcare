import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateAnthropometryDto {
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(50)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(150)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(60)
  headCircumferenceCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(40)
  armCircumferenceCm?: number;

  @IsOptional()
  @IsString()
  measurementDate?: string;
}
