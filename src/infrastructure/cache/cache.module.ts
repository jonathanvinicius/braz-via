import { Global, Module } from '@nestjs/common';
import { PropertyListCache } from './property-list-cache.service';

@Global()
@Module({
  providers: [PropertyListCache],
  exports: [PropertyListCache],
})
export class CacheModule {}
