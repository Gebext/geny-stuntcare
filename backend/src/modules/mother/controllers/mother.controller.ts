import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  Query,
} from '@nestjs/common';
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
    return this.motherService.upsertProfile(userId, dto);
  }

  @Patch('profile')
  @Roles('MOTHER')
  async updateProfile(@Request() req, @Body() dto: CreateMotherProfileDto) {
    const userId = req.user.id || req.user.sub;
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

  // --- ADMIN AREA: Monitoring ---
  @Get('all')
  @Roles('ADMIN')
  async getAllMothers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.motherService.getAllMothers({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
      status,
    });
  }

  @Post('assign')
  @Roles('ADMIN')
  async assignKader(@Body() data: { kaderId: string; motherId: string }) {
    return this.motherService.assignMotherToKader(data.kaderId, data.motherId);
  }

  @Delete('unassign')
  @Roles('ADMIN')
  async unassignKader(@Body() data: { motherId: string }) {
    return this.motherService.unassignMotherFromKader(data.motherId);
  }

  // --- KADER AREA: Dashboard ---

  // Endpoint untuk melihat Ibu Binaan (Grouping per Keluarga)
  @Get('assigned')
  @Roles('KADER')
  async getAssignedMothers(@Request() req) {
    const kaderId = req.user.id || req.user.sub;
    return this.motherService.getAssignedMothers(kaderId);
  }

  // Endpoint untuk melihat Semua Balita Binaan (Flat List)
  @Get('assigned-children')
  @Roles('KADER')
  async getAssignedChildren(
    @Request() req,
    @Query('name') name?: string,
    @Query('gender') gender?: string,
    @Query('stuntingRisk') stuntingRisk?: string,
    @Query('page') page?: string,
  ) {
    const kaderId = req.user.id || req.user.sub;
    return this.motherService.getAssignedChildren(kaderId, {
      name,
      gender,
      stuntingRisk,
      page: Number(page) || 1,
    });
  }
}
