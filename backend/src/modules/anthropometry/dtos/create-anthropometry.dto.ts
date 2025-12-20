import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsUUID,
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

  @IsString()
  @IsNotEmpty()
  measurementDate: string;
}
