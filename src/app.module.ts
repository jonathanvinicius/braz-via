import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import cognitoConfig from '@/config/cognito.config';
import s3Config from '@/config/s3.config';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { CognitoModule } from '@/infrastructure/cognito/cognito.module';
import { StorageModule } from '@/infrastructure/storage/storage.module';
import { WatermarkModule } from '@/infrastructure/watermark/watermark.module';
import { RepositoriesModule } from '@/infrastructure/repositories/repositories.module';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { HealthModule } from '@/modules/health/health.module';
import { PropertiesModule } from '@/modules/properties/properties.module';
import { UploadsModule } from '@/modules/uploads/uploads.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, cognitoConfig, s3Config],
    }),
    DatabaseModule,
    RepositoriesModule,
    CognitoModule,
    StorageModule,
    WatermarkModule,
    HealthModule,
    PropertiesModule,
    UploadsModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
