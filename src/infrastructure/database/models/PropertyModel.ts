import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface PropertyAttributes {
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
  createdAt?: Date;
  updatedAt?: Date;
}

type PropertyCreation = Optional<
  PropertyAttributes,
  | 'id'
  | 'headline'
  | 'lotSize'
  | 'suites'
  | 'evaluatedPrice'
  | 'featured'
  | 'sortOrder'
  | 'tags'
  | 'highlights'
  | 'images'
  | 'whatsappMessage'
  | 'createdBy'
>;

export class PropertyModel
  extends Model<PropertyAttributes, PropertyCreation>
  implements PropertyAttributes
{
  declare id: string;
  declare slug: string;
  declare title: string;
  declare headline: string | null;
  declare description: string;
  declare region: string;
  declare neighborhood: string;
  declare type: string;
  declare size: number;
  declare lotSize: number | null;
  declare bedrooms: number;
  declare bathrooms: number;
  declare suites: number | null;
  declare parking: number;
  declare price: number;
  declare evaluatedPrice: number | null;
  declare featured: boolean;
  declare sortOrder: number;
  declare tags: string[];
  declare highlights: string[];
  declare images: string[];
  declare whatsappMessage: string | null;
  declare createdBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PropertyModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    headline: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    size: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    lotSize: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'lot_size',
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    suites: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parking: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    evaluatedPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'evaluated_price',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    highlights: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    whatsappMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'whatsapp_message',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  },
  {
    sequelize,
    tableName: 'properties',
    modelName: 'Property',
  },
);
