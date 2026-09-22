import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type {
  IPropertyRepository,
  PropertyFilters,
} from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(filters: PropertyFilters = {}) {
    const items = await this.properties.list(filters);
    return items.map(toPropertyResponse);
  }
}
