import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateAnthropometryDto {
  @IsUUID()
  @IsNotEmpty()
  childId: string;

  @IsNumber()
  @Min(0.5)
  @Max(50)
  weightKg: number;

  @IsNumber()
  @Min(30)
  @Max(150)
  heightCm: number;

  @IsNumber()
  @IsOptional()
  @Min(20)
  @Max(60)
  headCircumferenceCm?: number;

  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(40)
  armCircumferenceCm?: number;

  @IsString()
  @IsNotEmpty()
  measurementDate: string;
}
