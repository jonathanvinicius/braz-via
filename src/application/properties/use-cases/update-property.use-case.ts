import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ensureUniqueSlug } from '@/application/properties/ensure-unique-slug';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';
import type { CreatePropertyCommand } from './create-property.use-case';

export type UpdatePropertyCommand = Partial<CreatePropertyCommand>;

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
  ) {}

  async execute(id: string, command: UpdatePropertyCommand) {
    const existing = await this.properties.findById(id);
    if (!existing) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    const nextSlug =
      command.slug?.trim() || command.title
        ? await ensureUniqueSlug(
            this.properties,
            command.slug?.trim() || command.title || existing.title,
            id,
          )
        : existing.slug;

    const updated = await this.properties.update(id, {
      slug: nextSlug,
      title: command.title?.trim() ?? existing.title,
      headline:
        command.headline !== undefined
          ? command.headline.trim() || null
          : existing.headline,
      description: command.description?.trim() ?? existing.description,
      region: command.region ?? existing.region,
      neighborhood: command.neighborhood?.trim() ?? existing.neighborhood,
      type: command.type ?? existing.type,
      size: command.size ?? existing.size,
      lotSize: command.lotSize !== undefined ? command.lotSize : existing.lotSize,
      bedrooms: command.bedrooms ?? existing.bedrooms,
      bathrooms: command.bathrooms ?? existing.bathrooms,
      suites: command.suites !== undefined ? command.suites : existing.suites,
      parking: command.parking ?? existing.parking,
      price: command.price ?? existing.price,
      evaluatedPrice:
        command.evaluatedPrice !== undefined
          ? command.evaluatedPrice
          : existing.evaluatedPrice,
      featured: command.featured ?? existing.featured,
      sortOrder: command.sortOrder ?? existing.sortOrder,
      tags: command.tags
        ? command.tags.map((tag) => tag.trim()).filter(Boolean)
        : existing.tags,
      highlights: command.highlights
        ? command.highlights.map((item) => item.trim()).filter(Boolean)
        : existing.highlights,
      images: command.images ? command.images.filter(Boolean) : existing.images,
      whatsappMessage:
        command.whatsappMessage !== undefined
          ? command.whatsappMessage.trim() || null
          : existing.whatsappMessage,
    });

    if (!updated) {
      throw new NotFoundException('Imóvel não encontrado');
    }
    return toPropertyResponse(updated);
  }
}
