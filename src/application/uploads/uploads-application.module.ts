import { Module } from '@nestjs/common';
import { UploadPropertyImageUseCase } from './use-cases/upload-property-image.use-case';

@Module({
  providers: [UploadPropertyImageUseCase],
  exports: [UploadPropertyImageUseCase],
})
export class UploadsApplicationModule {}
