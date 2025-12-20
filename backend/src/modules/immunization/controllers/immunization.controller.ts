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

@Controller('immunization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImmunizationController {
  constructor(private readonly service: ImmunizationService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateImmunizationDto) {
    // Ambil ID roles dari payload JWT
    const roleIds = req.user.roles.map((r: any) => r.roleId || r.id);
    return this.service.addRecord(req.user.id, roleIds, dto);
  }

  @Get('child/:childId')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getChildHistory(childId);
  }
}
