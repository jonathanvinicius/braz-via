import { Module } from '@nestjs/common';
import { PropertiesApplicationModule } from '@/application/properties/properties-application.module';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  imports: [PropertiesApplicationModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
