import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by location' })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by language' })
  language?: string;
}
