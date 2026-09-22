import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import type { AuthUserPayload } from '@/common/types/auth-user.type';
import { UserRole } from '@/domain/enums/UserRole';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ListPropertiesQueryDto } from './dto/list-properties-query.dto';
import { ReorderPropertiesDto } from './dto/reorder-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Public()
  @Get()
  list(@Query() query: ListPropertiesQueryDto) {
    return this.propertiesService.list(query);
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.propertiesService.getBySlug(slug);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body() dto: CreatePropertyDto,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    return this.propertiesService.create(dto, user);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Put('reorder')
  reorder(@Body() dto: ReorderPropertiesDto) {
    return this.propertiesService.reorder(dto.ids);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.propertiesService.delete(id);
  }
}
