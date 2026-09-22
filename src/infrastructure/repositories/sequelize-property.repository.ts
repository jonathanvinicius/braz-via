import { Injectable } from '@nestjs/common';
import { Op, type WhereOptions } from 'sequelize';
import type { Property } from '@/domain/entities/Property';
import type {
  CreatePropertyInput,
  IPropertyRepository,
  PropertyFilters,
  UpdatePropertyInput,
} from '@/domain/repositories/IPropertyRepository';
import { sequelize } from '@/infrastructure/database/sequelize';
import { PropertyModel } from '@/infrastructure/database/models/PropertyModel';
import { mapProperty } from '@/infrastructure/database/mappers/mapProperty';

@Injectable()
export class SequelizePropertyRepository implements IPropertyRepository {
  async list(filters: PropertyFilters = {}): Promise<Property[]> {
    const where: WhereOptions = {};

    if (filters.region && filters.region !== 'todas') {
      where.region = filters.region;
    }
    if (filters.type && filters.type !== 'Todos') {
      where.type = filters.type;
    }
    if (filters.featured) {
      where.featured = true;
    }
    if (filters.minBedrooms) {
      where.bedrooms = { [Op.gte]: filters.minBedrooms };
    }
    if (filters.maxPrice) {
      where.price = { [Op.lte]: filters.maxPrice };
    }
    if (filters.q?.trim()) {
      const q = `%${filters.q.trim()}%`;
      Object.assign(where, {
        [Op.or]: [
          { title: { [Op.iLike]: q } },
          { neighborhood: { [Op.iLike]: q } },
          { type: { [Op.iLike]: q } },
        ],
      });
    }

    const rows = await PropertyModel.findAll({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
    return rows.map(mapProperty);
  }

  async findById(id: string): Promise<Property | null> {
    const row = await PropertyModel.findByPk(id);
    return row ? mapProperty(row) : null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const row = await PropertyModel.findOne({ where: { slug } });
    return row ? mapProperty(row) : null;
  }

  async create(input: CreatePropertyInput): Promise<Property> {
    const row = await PropertyModel.create(input);
    return mapProperty(row);
  }

  async update(
    id: string,
    input: UpdatePropertyInput,
  ): Promise<Property | null> {
    const row = await PropertyModel.findByPk(id);
    if (!row) return null;
    await row.update(input);
    return mapProperty(row);
  }

  async delete(id: string): Promise<void> {
    await PropertyModel.destroy({ where: { id } });
  }

  async reorder(ids: string[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await Promise.all(
        ids.map((id, index) =>
          PropertyModel.update(
            { sortOrder: index + 1 },
            { where: { id }, transaction },
          ),
        ),
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async maxSortOrder(): Promise<number> {
    const value = await PropertyModel.max('sortOrder');
    return Number(value ?? 0);
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const where: WhereOptions = { slug };
    if (exceptId) {
      where.id = { [Op.ne]: exceptId };
    }
    const count = await PropertyModel.count({ where });
    return count > 0;
  }
}
