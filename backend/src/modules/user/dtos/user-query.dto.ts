import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UserQueryDto {
  // --- Pagination ---
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
  
  // --- Filtering / Searching ---
  @IsOptional()
  @IsString()
  search?: string; // Untuk mencari di name atau email

  @IsOptional()
  @IsString()
  email?: string; // Filter berdasarkan email persis
}