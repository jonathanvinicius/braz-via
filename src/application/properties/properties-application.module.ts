import { Module } from '@nestjs/common';
import { RepositoriesModule } from '@/infrastructure/repositories/repositories.module';
import { CreatePropertyUseCase } from './use-cases/create-property.use-case';
import { DeletePropertyUseCase } from './use-cases/delete-property.use-case';
import { GetPropertyByIdUseCase } from './use-cases/get-property-by-id.use-case';
import { GetPropertyBySlugUseCase } from './use-cases/get-property-by-slug.use-case';
import { ListPropertiesUseCase } from './use-cases/list-properties.use-case';
import { ReorderPropertiesUseCase } from './use-cases/reorder-properties.use-case';
import { UpdatePropertyUseCase } from './use-cases/update-property.use-case';

const useCases = [
  ListPropertiesUseCase,
  GetPropertyBySlugUseCase,
  GetPropertyByIdUseCase,
  CreatePropertyUseCase,
  UpdatePropertyUseCase,
  ReorderPropertiesUseCase,
  DeletePropertyUseCase,
];

@Module({
  imports: [RepositoriesModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class PropertiesApplicationModule {}
