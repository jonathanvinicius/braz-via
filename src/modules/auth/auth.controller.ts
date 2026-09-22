import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import type { AuthUserPayload } from '@/common/types/auth-user.type';
import { UserRole } from '@/domain/enums/UserRole';
import { AuthService } from './auth.service';
import { CompleteNewPasswordDto, LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('complete-password')
  completeNewPassword(@Body() dto: CompleteNewPasswordDto) {
    return this.authService.completeNewPassword(
      dto.email,
      dto.newPassword,
      dto.session,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('me')
  me(@CurrentUser() user: AuthUserPayload) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      cognitoSub: user.cognitoSub,
      groups: user.groups,
    };
  }
}
