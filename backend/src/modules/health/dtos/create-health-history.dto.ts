import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateHealthHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  childId: string;

  @IsString()
  @IsNotEmpty()
  diseaseName: string;

  @IsDateString()
  @IsNotEmpty()
  diagnosisDate: string;

  @IsBoolean()
  @IsNotEmpty()
  isChronic: boolean;
}
