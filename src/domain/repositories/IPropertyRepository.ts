import type { Property } from '../entities/Property';

export interface PropertyFilters {
  region?: string;
  type?: string;
  q?: string;
  minBedrooms?: number;
  maxPrice?: number;
  featured?: boolean;
}

export type CreatePropertyInput = Omit<
  Property,
  'id' | 'createdAt' | 'updatedAt'
> & { id?: string };

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export interface IPropertyRepository {
  list(filters?: PropertyFilters): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  create(input: CreatePropertyInput): Promise<Property>;
  update(id: string, input: UpdatePropertyInput): Promise<Property | null>;
  delete(id: string): Promise<void>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;
  maxSortOrder(): Promise<number>;
  reorder(ids: string[]): Promise<void>;
}
