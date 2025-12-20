import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateNutritionDto {
  @IsUUID()
  @IsNotEmpty()
  childId: string;

  @IsString()
  @IsNotEmpty()
  foodType: string;

  @IsNumber()
  @Min(1)
  frequencyPerDay: number;

  @IsString()
  @IsNotEmpty()
  proteinSource: string;
  @IsDateString()
  @IsNotEmpty()
  recordedAt: string;
}
