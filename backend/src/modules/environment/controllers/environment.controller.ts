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
import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto } from '../dtos/create-environment.dto';

@Controller('environment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnvironmentController {
  constructor(private readonly service: EnvironmentService) {}

  @Post()
  async upsert(@Request() req, @Body() dto: CreateEnvironmentDto) {
    const roleIds = req.user.roles.map((r: any) => r.roleId || r.id);
    return this.service.upsertEnvironment(req.user.id, roleIds, dto);
  }

  @Get('mother/:motherId')
  async get(@Param('motherId') motherId: string) {
    return this.service.getByMother(motherId);
  }
}
