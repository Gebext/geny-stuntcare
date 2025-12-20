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
import { NutritionService } from '../services/nutrition.service';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';

@Controller('nutrition')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NutritionController {
  constructor(private readonly service: NutritionService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateNutritionDto) {
    const roleIds = req.user.roles.map((r: any) => r.roleId || r.id);
    return this.service.addRecord(req.user.id, roleIds, dto);
  }

  @Get('child/:childId')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getHistory(childId);
  }
}
