import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class UpdateHealthHistoryDto {
  @IsOptional()
  @IsString()
  diseaseName?: string;

  @IsOptional()
  @IsDateString()
  diagnosisDate?: string;

  @IsOptional()
  @IsBoolean()
  isChronic?: boolean;
}
