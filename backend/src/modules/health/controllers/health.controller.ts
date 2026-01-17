import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HealthService } from '../services/health.service';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ResponseWrapperInterceptor } from 'src/common/interceptors/response-wrapper.interceptor';

@UseInterceptors(ClassSerializerInterceptor, ResponseWrapperInterceptor)
@Controller('health-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Post()
  @Roles('KADER', 'MOTHER')
  async create(@Request() req, @Body() dto: CreateHealthHistoryDto) {
    const userId = req.user.id || req.user.sub;
    return this.service.addRecord(userId, dto);
  }

  @Get('/child/:childId')
  @Roles('KADER', 'MOTHER', 'ADMIN')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getHistory(childId);
  }
}
