import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ResponseWrapperInterceptor } from 'src/common/interceptors/response-wrapper.interceptor';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';

@UseInterceptors(ClassSerializerInterceptor, ResponseWrapperInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get('role/:roleName')
  @Roles('ADMIN')
  async getUsersByRole(@Param('roleName') roleName: string) {
    const users = await this.userService.findByRole(roleName);
    return users; // Interceptor akan membungkus ini dengan { success: true, data: ... }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(@Query() query: UserQueryDto): Promise<any> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KADER')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  /**
   * Update user
   * Bisa diakses ADMIN untuk manajemen, atau Mother (dengan logic tambahan di Service)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KADER', 'MOTHER')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Menghapus user
   * Benar-benar hanya ADMIN yang berhak menghapus akun.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ id: string }> {
    const removedUser = await this.userService.remove(id);
    return { id: removedUser.id };
  }

  // Di UserController
  @Post('admin/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async adminCreateUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    // Panggil service create.
    // Karena UserRepository sudah bisa handle 'role' di dalam DTO,
    // maka ini akan aman selama UserService tidak menghapus field 'role' tersebut.
    return this.userService.create(createUserDto);
  }
}
