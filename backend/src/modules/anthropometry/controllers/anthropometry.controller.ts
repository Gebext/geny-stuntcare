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
import { AnthropometryService } from '../services/anthropometry.service';
import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';

@Controller('anthropometry')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnthropometryController {
  constructor(private readonly service: AnthropometryService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateAnthropometryDto) {
    // Ambil roles dari user roles array (id-nya saja)
    const roleIds = req.user.roles.map((ur: any) => ur.roleId);
    return this.service.recordMeasurement(
      req.user.id,
      req.user.name,
      roleIds,
      dto,
    );
  }

  @Get('child/:childId')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getHistoryByChild(childId);
  }
}
