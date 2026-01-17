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
import { NutritionService } from '../services/nutrition.service';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ResponseWrapperInterceptor } from 'src/common/interceptors/response-wrapper.interceptor';

@UseInterceptors(ClassSerializerInterceptor, ResponseWrapperInterceptor)
@Controller('nutrition')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NutritionController {
  constructor(private readonly service: NutritionService) {}

  @Post()
  @Roles('KADER', 'MOTHER')
  async create(@Request() req, @Body() dto: CreateNutritionDto) {
    const userId = req.user.id || req.user.sub;
    return this.service.addRecord(userId, dto);
  }

  @Get('child/:childId')
  @Roles('KADER', 'MOTHER', 'ADMIN')
  async getHistory(@Param('childId') childId: string) {
    return this.service.getHistory(childId);
  }
}
