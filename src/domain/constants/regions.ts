export const REGION_LABELS = {
  anapolis: 'Anápolis',
  goiania: 'Goiânia',
  brasilia: 'Brasília',
  'caldas-novas': 'Caldas Novas',
  'rio-quente': 'Rio Quente',
} as const;

export type RegionId = keyof typeof REGION_LABELS;

export const PROPERTY_TYPES = [
  'Casa',
  'Apartamento',
  'Cobertura',
  'Terreno',
  'Comercial',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
