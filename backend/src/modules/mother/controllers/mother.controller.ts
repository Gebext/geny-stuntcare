import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException, Patch, Param, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MotherService } from '../services/mother.service';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';
import { ResponseWrapperInterceptor } from 'src/common/interceptors/response-wrapper.interceptor';

@UseInterceptors(ClassSerializerInterceptor, ResponseWrapperInterceptor)
@Controller('mother')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class MotherController {
  constructor(private readonly motherService: MotherService) {}

  @Post('profile')
  @Roles('MOTHER') 
  async handleProfile(@Request() req, @Body() dto: CreateMotherProfileDto) {
    const userId = req.user.id || req.user.sub;
    if (!userId) throw new ForbiddenException('User ID tidak ditemukan dalam token');

    return this.motherService.upsertProfile(userId, dto);
  }

  @Patch('profile')
  @Roles('MOTHER')
  async updateProfile(@Request() req, @Body() dto: CreateMotherProfileDto) {
    const userId = req.user.id || req.user.sub;
    if (!userId) throw new ForbiddenException('User ID tidak ditemukan dalam token');

    return this.motherService.upsertProfile(userId, dto);
  }

  @Get('profile/me')
  @Roles('MOTHER', 'KADER', 'ADMIN') 
  async getMyProfile(@Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.motherService.getProfile(userId);
  }

  @Get('profile/:userId') 
  @Roles('KADER', 'ADMIN')
  async getMotherProfile(@Param('userId') userId: string) {
    return this.motherService.getProfile(userId);
  }
}