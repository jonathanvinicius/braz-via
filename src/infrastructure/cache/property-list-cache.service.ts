import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const PROPERTY_LIST_KEY = 'properties:list';
const PROPERTY_LIST_TTL_SECONDS = 604800;

@Injectable()
export class PropertyListCache implements OnModuleDestroy {
  private readonly client: Redis | null;

  constructor(config: ConfigService) {
    const host = config.get<string>('valkey.host') ?? '';
    const port = config.get<number>('valkey.port') ?? 6379;
    if (!host) {
      this.client = null;
      return;
    }

    this.client = new Redis({
      host,
      port,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      commandTimeout: 2000,
      retryStrategy: () => null,
    });
    this.client.on('error', () => undefined);
  }

  async onModuleDestroy() {
    if (!this.client) return;
    try {
      await this.client.quit();
    } catch {
      this.client.disconnect();
    }
  }

  async getList(): Promise<string | null> {
    const client = await this.ready();
    if (!client) return null;
    try {
      return await client.get(PROPERTY_LIST_KEY);
    } catch {
      return null;
    }
  }

  async setList(value: string): Promise<void> {
    const client = await this.ready();
    if (!client) return;
    try {
      await client.set(
        PROPERTY_LIST_KEY,
        value,
        'EX',
        PROPERTY_LIST_TTL_SECONDS,
      );
    } catch {
      return;
    }
  }

  async invalidate(): Promise<void> {
    const client = await this.ready();
    if (!client) return;
    try {
      await client.del(PROPERTY_LIST_KEY);
    } catch {
      return;
    }
  }

  private async ready(): Promise<Redis | null> {
    if (!this.client) return null;
    try {
      if (this.client.status === 'wait') {
        await this.client.connect();
      }
      if (this.client.status !== 'ready') return null;
      return this.client;
    } catch {
      return null;
    }
  }
}
