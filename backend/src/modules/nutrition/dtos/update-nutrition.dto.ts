import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateNutritionDto {
  @IsOptional()
  @IsString()
  foodType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  frequencyPerDay?: number;

  @IsOptional()
  @IsString()
  proteinSource?: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}
