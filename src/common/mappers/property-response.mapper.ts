import { REGION_LABELS, type RegionId } from '@/domain/constants/regions';
import type { Property } from '@/domain/entities/Property';

export function toPropertyResponse(property: Property) {
  const regionLabel =
    REGION_LABELS[property.region as RegionId] ?? property.region;
  const images = property.images.filter(Boolean);

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    headline: property.headline ?? undefined,
    description: property.description,
    region: property.region,
    regionLabel,
    neighborhood: property.neighborhood,
    type: property.type,
    size: property.size,
    lotSize: property.lotSize ?? undefined,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    suites: property.suites ?? undefined,
    parking: property.parking,
    price: property.price,
    evaluatedPrice: property.evaluatedPrice ?? undefined,
    featured: property.featured,
    sortOrder: property.sortOrder,
    tags: property.tags,
    highlights: property.highlights,
    image: images[0] ?? '',
    images,
    whatsappMessage: property.whatsappMessage ?? undefined,
  };
}
