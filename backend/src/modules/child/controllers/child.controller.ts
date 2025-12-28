import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Request,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ResponseWrapperInterceptor } from 'src/common/interceptors/response-wrapper.interceptor';
import { ChildFilterDto, CreateChildDto } from '../dtos/create-child.dto';
import { ChildService } from '../services/child-service';

@UseInterceptors(ResponseWrapperInterceptor)
@Controller('children')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  // Fitur baru: Get All Children dengan Filtering (Admin/Kader Only)
  @Get()
  @Roles('KADER', 'ADMIN')
  async findAll(@Query() query: ChildFilterDto) {
    return this.childService.findAll(query);
  }

  @Post()
  @Roles('MOTHER')
  async create(@Request() req, @Body() dto: CreateChildDto) {
    const userId = req.user.id;
    return this.childService.createChild(userId, dto);
  }

  @Get('me')
  @Roles('MOTHER')
  async getMyChildren(@Request() req) {
    return this.childService.getMyChildren(req.user.id);
  }

  @Patch(':id')
  @Roles('MOTHER')
  async update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return this.childService.updateChild(req.user.id, id, dto);
  }

  @Patch(':id/verify')
  @Roles('KADER', 'ADMIN')
  async verify(@Param('id') id: string, @Body('stuntingRisk') risk: string) {
    return this.childService.verifyByKader(id, risk);
  }

  @Get(':id')
  @Roles('KADER', 'ADMIN') // Hanya boleh diakses oleh otoritas terkait
  async getDetail(@Param('id') id: string) {
    return this.childService.findOne(id);
  }
}
