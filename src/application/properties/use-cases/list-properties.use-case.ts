import { Inject, Injectable } from '@nestjs/common';
import { PropertyListCache } from '@/infrastructure/cache/property-list-cache.service';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type {
  IPropertyRepository,
  PropertyFilters,
} from '@/domain/repositories/IPropertyRepository';

type PropertyListItem = ReturnType<typeof toPropertyResponse>;

function isUnfilteredPublicList(filters: PropertyFilters): boolean {
  const region = filters.region?.trim();
  const type = filters.type?.trim();
  const query = filters.q?.trim();
  return (
    (!region || region === 'todas') &&
    (!type || type === 'Todos') &&
    !query &&
    !filters.minBedrooms &&
    !filters.maxPrice &&
    !filters.featured
  );
}

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
    private readonly propertyListCache: PropertyListCache,
  ) {}

  async execute(filters: PropertyFilters = {}): Promise<PropertyListItem[]> {
    if (!isUnfilteredPublicList(filters)) {
      const items = await this.properties.list(filters);
      return items.map(toPropertyResponse);
    }

    const cached = await this.propertyListCache.getList();
    if (cached) {
      try {
        const parsed: unknown = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed as PropertyListItem[];
        }
      } catch {
        return this.loadAndStorePublicList();
      }
    }

    return this.loadAndStorePublicList();
  }

  private async loadAndStorePublicList(): Promise<PropertyListItem[]> {
    const items = (await this.properties.list({})).map(toPropertyResponse);
    await this.propertyListCache.setList(JSON.stringify(items));
    return items;
  }
}
