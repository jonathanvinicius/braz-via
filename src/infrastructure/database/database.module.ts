import { Global, Module, OnModuleInit } from '@nestjs/common';
import { sequelize } from './sequelize';
import '@/infrastructure/database/models';

@Global()
@Module({})
export class DatabaseModule implements OnModuleInit {
  async onModuleInit() {
    await sequelize.authenticate();
  }
}
