import { Inject, Injectable } from '@nestjs/common';
import { PropertyListCache } from '@/infrastructure/cache/property-list-cache.service';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class ReorderPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
    private readonly propertyListCache: PropertyListCache,
  ) {}

  async execute(ids: string[]) {
    await this.properties.reorder(ids);
    await this.propertyListCache.invalidate();
    const items = await this.properties.list();
    return items.map(toPropertyResponse);
  }
}
