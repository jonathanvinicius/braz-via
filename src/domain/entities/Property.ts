export interface Property {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  description: string;
  region: string;
  neighborhood: string;
  type: string;
  size: number;
  lotSize: number | null;
  bedrooms: number;
  bathrooms: number;
  suites: number | null;
  parking: number;
  price: number;
  evaluatedPrice: number | null;
  featured: boolean;
  sortOrder: number;
  tags: string[];
  highlights: string[];
  images: string[];
  whatsappMessage: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
