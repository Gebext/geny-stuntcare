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
import { ImmunizationService } from '../services/immunization.service';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
import { Roles } from 'src/common/decorators/roles.decorators';

@Controller('immunization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImmunizationController {
  constructor(private readonly service: ImmunizationService) {}

  @Post()
  @Roles('KADER', 'MOTHER') // Pastikan hanya role ini yang bisa akses
  async create(@Request() req, @Body() dto: CreateImmunizationDto) {
    const userId = req.user.id || req.user.sub;
    return this.service.addRecord(userId, dto);
  }

  @Get('child/:childId')
  @Roles('KADER', 'MOTHER', 'ADMIN')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getChildHistory(childId);
  }
}
