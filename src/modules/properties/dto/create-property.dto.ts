import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PROPERTY_TYPES } from '@/domain/constants/regions';

const REGIONS = [
  'anapolis',
  'goiania',
  'brasilia',
  'caldas-novas',
  'rio-quente',
];

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  slug?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ enum: REGIONS })
  @IsIn(REGIONS)
  region!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  neighborhood!: string;

  @ApiProperty({ enum: PROPERTY_TYPES })
  @IsIn(PROPERTY_TYPES)
  type!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  size!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  lotSize?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  suites?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parking!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  evaluatedPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Posição na vitrine. Quanto menor o número, mais acima aparece.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsappMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;
}
