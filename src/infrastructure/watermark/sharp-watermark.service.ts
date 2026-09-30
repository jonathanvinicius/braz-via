import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import type {
  IWatermarkService,
  WatermarkedImage,
} from '@/domain/services/IWatermarkService';

const CENTER_LOGO_RATIO = 0.4;
const CENTER_LOGO_OPACITY = 0.16;
const CORNER_LOGO_RATIO = 0.2;
const CORNER_LOGO_OPACITY = 0.92;
const EDGE_PADDING_RATIO = 0.035;

@Injectable()
export class SharpWatermarkService implements IWatermarkService {
  async apply(buffer: Buffer, _mimeType: string): Promise<WatermarkedImage> {
    const image = sharp(buffer, { failOn: 'none' }).rotate();
    const metadata = await image.metadata();
    const width = metadata.width ?? 1200;
    const height = metadata.height ?? 800;
    const shortSide = Math.min(width, height);
    const padding = Math.max(
      14,
      Math.round(shortSide * EDGE_PADDING_RATIO),
    );

    const centerLogo = await this.buildLogoOverlay({
      targetWidth: Math.max(120, Math.round(shortSide * CENTER_LOGO_RATIO)),
      opacity: CENTER_LOGO_OPACITY,
      padding: 0,
    });

    const cornerLogo = await this.buildLogoOverlay({
      targetWidth: Math.max(88, Math.round(width * CORNER_LOGO_RATIO)),
      opacity: CORNER_LOGO_OPACITY,
      padding,
    });

    const output = await image
      .composite([
        { input: centerLogo, gravity: 'centre' },
        { input: cornerLogo, gravity: 'southeast' },
      ])
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    return { buffer: output, mimeType: 'image/jpeg' };
  }

  private async buildLogoOverlay(options: {
    targetWidth: number;
    opacity: number;
    padding: number;
  }) {
    const resized = await sharp(this.resolveLogoPath())
      .resize({
        width: options.targetWidth,
        withoutEnlargement: false,
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = resized.data;
    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3];
      if (alpha === 0) continue;
      pixels[index + 3] = Math.round(alpha * options.opacity);
    }

    let pipeline = sharp(pixels, { raw: resized.info }).png();

    if (options.padding > 0) {
      pipeline = pipeline.extend({
        top: 0,
        left: 0,
        right: options.padding,
        bottom: options.padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });
    }

    return pipeline.toBuffer();
  }

  private resolveLogoPath() {
    const candidates = [
      join(__dirname, '../../assets/watermark.png'),
      join(process.cwd(), 'assets/watermark.png'),
      join(process.cwd(), 'dist/assets/watermark.png'),
      join(process.cwd(), 'src/assets/watermark.png'),
    ];
    const found = candidates.find((path) => existsSync(path));
    if (!found) {
      throw new Error(
        "Arquivo da marca d'água não encontrado (assets/watermark.png)",
      );
    }
    return found;
  }
}
