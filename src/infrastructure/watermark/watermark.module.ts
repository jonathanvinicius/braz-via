import { Global, Module } from '@nestjs/common';
import { WATERMARK_SERVICE } from '@/common/constants/injection-tokens';
import { SharpWatermarkService } from './sharp-watermark.service';

@Global()
@Module({
  providers: [
    SharpWatermarkService,
    { provide: WATERMARK_SERVICE, useClass: SharpWatermarkService },
  ],
  exports: [WATERMARK_SERVICE],
})
export class WatermarkModule {}
