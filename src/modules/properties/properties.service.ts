import { Injectable } from '@nestjs/common';
import { CreatePropertyUseCase } from '@/application/properties/use-cases/create-property.use-case';
import { DeletePropertyUseCase } from '@/application/properties/use-cases/delete-property.use-case';
import { GetPropertyByIdUseCase } from '@/application/properties/use-cases/get-property-by-id.use-case';
import { GetPropertyBySlugUseCase } from '@/application/properties/use-cases/get-property-by-slug.use-case';
import { ListPropertiesUseCase } from '@/application/properties/use-cases/list-properties.use-case';
import { ReorderPropertiesUseCase } from '@/application/properties/use-cases/reorder-properties.use-case';
import { UpdatePropertyUseCase } from '@/application/properties/use-cases/update-property.use-case';
import type { AuthUserPayload } from '@/common/types/auth-user.type';
import type { PropertyFilters } from '@/domain/repositories/IPropertyRepository';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
    private readonly getPropertyBySlugUseCase: GetPropertyBySlugUseCase,
    private readonly getPropertyByIdUseCase: GetPropertyByIdUseCase,
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
    private readonly reorderPropertiesUseCase: ReorderPropertiesUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
  ) {}

  list(filters: PropertyFilters) {
    return this.listPropertiesUseCase.execute(filters);
  }

  getBySlug(slug: string) {
    return this.getPropertyBySlugUseCase.execute(slug);
  }

  getById(id: string) {
    return this.getPropertyByIdUseCase.execute(id);
  }

  create(dto: CreatePropertyDto, user?: AuthUserPayload) {
    return this.createPropertyUseCase.execute({
      ...dto,
      createdBy: user?.id ?? null,
    });
  }

  update(id: string, dto: UpdatePropertyDto) {
    return this.updatePropertyUseCase.execute(id, dto);
  }

  delete(id: string) {
    return this.deletePropertyUseCase.execute(id);
  }

  reorder(ids: string[]) {
    return this.reorderPropertiesUseCase.execute(ids);
  }
}

