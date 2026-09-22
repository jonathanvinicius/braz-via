import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import type {
  IWatermarkService,
  WatermarkedImage,
} from '@/domain/services/IWatermarkService';

const LOGO_RATIO = 0.2;
const LOGO_OPACITY = 0.78;
const EDGE_PADDING_RATIO = 0.03;

@Injectable()
export class SharpWatermarkService implements IWatermarkService {
  async apply(buffer: Buffer, _mimeType: string): Promise<WatermarkedImage> {
    const image = sharp(buffer).rotate();
    const metadata = await image.metadata();
    const width = metadata.width ?? 1200;
    const height = metadata.height ?? 800;
    const logoWidth = Math.max(72, Math.round(width * LOGO_RATIO));
    const padding = Math.max(12, Math.round(Math.min(width, height) * EDGE_PADDING_RATIO));
    const logo = await this.buildLogo(logoWidth, padding);

    const output = await image
      .composite([{ input: logo, gravity: 'southeast' }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();

    return { buffer: output, mimeType: 'image/jpeg' };
  }

  private async buildLogo(width: number, padding: number) {
    const resized = await sharp(this.resolveLogoPath())
      .resize({ width, withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = resized.data;
    for (let i = 3; i < pixels.length; i += 4) {
      pixels[i] = Math.round(pixels[i] * LOGO_OPACITY);
    }

    return sharp(pixels, { raw: resized.info })
      .png()
      .extend({
        top: 0,
        left: 0,
        right: padding,
        bottom: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();
  }

  private resolveLogoPath() {
    const candidates = [
      join(__dirname, '../../assets/watermark.png'),
      join(process.cwd(), 'src/assets/watermark.png'),
      join(process.cwd(), 'dist/assets/watermark.png'),
    ];
    const found = candidates.find((path) => existsSync(path));
    if (!found) {
      throw new Error('Arquivo da marca d’água não encontrado (src/assets/watermark.png)');
    }
    return found;
  }
}
