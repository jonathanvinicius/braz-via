import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class ReorderPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(ids: string[]) {
    await this.properties.reorder(ids);
    const items = await this.properties.list();
    return items.map(toPropertyResponse);
  }
}
