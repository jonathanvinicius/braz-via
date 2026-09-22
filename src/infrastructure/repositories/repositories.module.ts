import { Module } from '@nestjs/common';
import {
  PROPERTY_REPOSITORY,
  USER_REPOSITORY,
} from '@/common/constants/injection-tokens';
import { SequelizePropertyRepository } from './sequelize-property.repository';
import { SequelizeUserRepository } from './sequelize-user.repository';

@Module({
  providers: [
    { provide: USER_REPOSITORY, useClass: SequelizeUserRepository },
    { provide: PROPERTY_REPOSITORY, useClass: SequelizePropertyRepository },
  ],
  exports: [USER_REPOSITORY, PROPERTY_REPOSITORY],
})
export class RepositoriesModule {}
