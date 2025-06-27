import { IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  language?: string;
}
