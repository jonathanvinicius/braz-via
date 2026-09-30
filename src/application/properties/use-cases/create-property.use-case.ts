import { Inject, Injectable } from '@nestjs/common';
import { ensureUniqueSlug } from '@/application/properties/ensure-unique-slug';
import { PropertyListCache } from '@/infrastructure/cache/property-list-cache.service';
import { PROPERTY_REPOSITORY } from '@/common/constants/injection-tokens';
import { toPropertyResponse } from '@/common/mappers/property-response.mapper';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

export type CreatePropertyCommand = {
  title: string;
  headline?: string;
  slug?: string;
  description: string;
  region: string;
  neighborhood: string;
  type: string;
  size: number;
  lotSize?: number;
  bedrooms: number;
  bathrooms: number;
  suites?: number;
  parking: number;
  price: number;
  evaluatedPrice?: number;
  featured?: boolean;
  sortOrder?: number;
  tags?: string[];
  highlights?: string[];
  images: string[];
  whatsappMessage?: string;
  createdBy?: string | null;
};

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly properties: IPropertyRepository,
    private readonly propertyListCache: PropertyListCache,
  ) {}

  async execute(command: CreatePropertyCommand) {
    const slug = await ensureUniqueSlug(
      this.properties,
      command.slug?.trim() || command.title,
    );
    const sortOrder =
      command.sortOrder !== undefined
        ? command.sortOrder
        : (await this.properties.maxSortOrder()) + 1;

    const created = await this.properties.create({
      slug,
      title: command.title.trim(),
      headline: command.headline?.trim() || null,
      description: command.description.trim(),
      region: command.region,
      neighborhood: command.neighborhood.trim(),
      type: command.type,
      size: command.size,
      lotSize: command.lotSize ?? null,
      bedrooms: command.bedrooms,
      bathrooms: command.bathrooms,
      suites: command.suites ?? null,
      parking: command.parking,
      price: command.price,
      evaluatedPrice: command.evaluatedPrice ?? null,
      featured: Boolean(command.featured),
      sortOrder,
      tags: (command.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
      highlights: (command.highlights ?? [])
        .map((item) => item.trim())
        .filter(Boolean),
      images: (command.images ?? []).filter(Boolean),
      whatsappMessage: command.whatsappMessage?.trim() || null,
      createdBy: command.createdBy ?? null,
    });

    await this.propertyListCache.invalidate();
    return toPropertyResponse(created);
  }
}
