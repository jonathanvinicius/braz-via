import type { Property } from '@/domain/entities/Property';
import type { PropertyModel } from '../models/PropertyModel';

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function mapProperty(model: PropertyModel): Property {
  return {
    id: model.id,
    slug: model.slug,
    title: model.title,
    headline: model.headline,
    description: model.description,
    region: model.region,
    neighborhood: model.neighborhood,
    type: model.type,
    size: toNumber(model.size),
    lotSize: toNumberOrNull(model.lotSize),
    bedrooms: toNumber(model.bedrooms),
    bathrooms: toNumber(model.bathrooms),
    suites: toNumberOrNull(model.suites),
    parking: toNumber(model.parking),
    price: toNumber(model.price),
    evaluatedPrice: toNumberOrNull(model.evaluatedPrice),
    featured: model.featured,
    sortOrder: toNumber(model.sortOrder),
    tags: model.tags ?? [],
    highlights: model.highlights ?? [],
    images: model.images ?? [],
    whatsappMessage: model.whatsappMessage,
    createdBy: model.createdBy,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}
