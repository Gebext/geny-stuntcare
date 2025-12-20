import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateImmunizationDto {
  @IsUUID()
  @IsNotEmpty()
  childId: string;

  @IsString()
  @IsNotEmpty()
  vaccineName: string;

  @IsString()
  @IsNotEmpty()
  status: string;
  @IsDateString()
  @IsNotEmpty()
  dateGiven: string;
}
