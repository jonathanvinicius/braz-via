import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(id: string) {
    const existing = await this.properties.findById(id);
    if (!existing) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    await this.properties.delete(id);
  }
}
