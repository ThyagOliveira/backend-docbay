import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by location' })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by language' })
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;
}
