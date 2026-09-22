import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MIME_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface UploadedImageResult {
  key: string;
  url: string;
}

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('s3.region') ?? 'sa-east-1';
    this.client = new S3Client({ region });
  }

  isS3Configured(): boolean {
    return Boolean(this.config.get<string>('s3.bucket'));
  }

  async uploadImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<UploadedImageResult> {
    const normalizedMime = mimeType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
      throw new BadRequestException(
        'Formato inválido. Envie JPEG, PNG ou WebP.',
      );
    }

    const maxBytes = this.config.get<number>('s3.maxUploadBytes') ?? 5_242_880;
    if (buffer.length > maxBytes) {
      throw new BadRequestException(
        `Imagem muito grande. Máximo ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      );
    }

    const extension = MIME_EXTENSION[normalizedMime];
    const prefix =
      this.config.get<string>('s3.propertiesPrefix') ?? 'properties';
    const filename = `${randomUUID()}.${extension}`;

    if (this.isS3Configured()) {
      const bucket = this.config.get<string>('s3.bucket') as string;
      const key = `${prefix}/${filename}`;
      await this.client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: normalizedMime,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      return { key, url: this.buildPublicUrl(bucket, key) };
    }

    const dir = join(process.cwd(), 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buffer);
    const appUrl = (
      this.config.get<string>('app.url') ?? 'http://localhost:3333'
    ).replace(/\/$/, '');
    return {
      key: `uploads/${filename}`,
      url: `${appUrl}/uploads/${filename}`,
    };
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) return;

    if (this.isS3Configured()) {
      const bucket = this.config.get<string>('s3.bucket');
      if (!bucket) return;
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      );
      return;
    }

    if (key.startsWith('uploads/')) {
      try {
        await unlink(join(process.cwd(), key));
      } catch {
        // arquivo já ausente
      }
    }
  }

  private buildPublicUrl(bucket: string, key: string): string {
    const customBase = this.config.get<string>('s3.publicBaseUrl');
    if (customBase) {
      return `${customBase.replace(/\/$/, '')}/${key}`;
    }
    const region = this.config.get<string>('s3.region') ?? 'sa-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
