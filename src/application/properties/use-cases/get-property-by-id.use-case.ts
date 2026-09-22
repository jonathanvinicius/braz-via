import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class GetPropertyByIdUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(id: string) {
    const property = await this.properties.findById(id);
    if (!property) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    return toPropertyResponse(property);
  }
}
