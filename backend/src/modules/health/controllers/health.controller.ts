import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HealthService } from '../services/health.service';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';

@Controller('health-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateHealthHistoryDto) {
    const roleIds = req.user.roles.map((r: any) => r.roleId || r.id);
    return this.service.addRecord(req.user.id, roleIds, dto);
  }

  @Get('/child/:childId')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getHistory(childId);
  }
}
