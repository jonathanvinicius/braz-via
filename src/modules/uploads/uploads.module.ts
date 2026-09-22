import { Module } from '@nestjs/common';
import { UploadsApplicationModule } from '@/application/uploads/uploads-application.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [UploadsApplicationModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
