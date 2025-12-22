import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEnvironmentDto {
  @IsUUID()
  @IsNotEmpty()
  motherId: string;

  @IsBoolean()
  @IsNotEmpty()
  cleanWater: boolean;

  @IsString()
  @IsNotEmpty()
  sanitation: string;

  @IsNumber()
  @Min(0)
  distanceFaskesKm: number;

  @IsString()
  @IsNotEmpty()
  transportation: string;
}
