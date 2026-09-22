import { slugify } from '@/application/shared/slugify';
import type { IPropertyRepository } from '@/domain/repositories/IPropertyRepository';

export async function ensureUniqueSlug(
  repository: IPropertyRepository,
  raw: string,
  exceptId?: string,
) {
  const base = slugify(raw) || 'imovel';
  let candidate = base;
  let i = 2;
  while (await repository.slugExists(candidate, exceptId)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}
