import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateImmunizationDto {
  @IsOptional()
  @IsString()
  vaccineName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dateGiven?: string;
}
