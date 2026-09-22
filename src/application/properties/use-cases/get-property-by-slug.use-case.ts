import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class GetPropertyBySlugUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(slug: string) {
    const property =
      (await this.properties.findBySlug(slug)) ??
      (await this.properties.findById(slug));
    if (!property) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    return toPropertyResponse(property);
  }
}
