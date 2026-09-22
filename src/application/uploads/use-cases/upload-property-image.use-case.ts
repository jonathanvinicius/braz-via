import { Inject, Injectable } from '@nestjs/common';
import { WATERMARK_SERVICE } from '@/common/constants/injection-tokens';
import type { IWatermarkService } from '@/domain/services/IWatermarkService';
import { StorageService } from '@/infrastructure/storage/storage.service';

@Injectable()
export class UploadPropertyImageUseCase {
  constructor(
    @Inject(WATERMARK_SERVICE)
    private readonly watermark: IWatermarkService,
    private readonly storage: StorageService,
  ) {}

  async execute(file: Express.Multer.File) {
    const watermarked = await this.watermark.apply(file.buffer, file.mimetype);
    return this.storage.uploadImage(watermarked.buffer, watermarked.mimeType);
  }
}
