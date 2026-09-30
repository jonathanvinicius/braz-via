import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PropertyListCache } from '@/infrastructure/cache/property-list-cache.service';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
    private readonly propertyListCache: PropertyListCache,
  ) {}

  async execute(id: string) {
    const existing = await this.properties.findById(id);
    if (!existing) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    await this.properties.delete(id);
    await this.propertyListCache.invalidate();
  }
}
