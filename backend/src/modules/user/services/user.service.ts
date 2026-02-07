import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { UserResponseDto } from 'src/modules/user/dtos/user-response.dto';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(
      `Proses pembuatan user baru untuk email: ${createUserDto.email}`,
    );

    try {
      const { password, ...userData } = createUserDto;

      // Check validation for phone number
      if (userData.phone) {
        const existingPhone = await this.userRepository.findOneByPhone(
          userData.phone,
        );

        if (existingPhone) {
          throw new BadRequestException('Nomor HP sudah terdaftar');
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const createdUser = await this.userRepository.create({
        ...userData,
        passwordHash,
      });

      this.logger.log(`User berhasil dibuat dengan ID: ${createdUser.id}`);
      return plainToInstance(UserResponseDto, createdUser);
    } catch (error) {
      this.logger.error(`Gagal membuat user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(query: UserQueryDto): Promise<any> {
    this.logger.debug(`Fetching users dengan filter: ${JSON.stringify(query)}`);

    const { page, limit, search, email, role } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};

    if (email) where.email = email;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'ALL') {
      where.roles = {
        some: {
          role: { name: role.toUpperCase() },
        },
      };
    }

    try {
      const [users, totalCount] = await this.userRepository.findManyAndCount({
        skip,
        take: limit,
        where,
      });

      this.logger.log(
        `Berhasil mengambil ${users.length} user (Total: ${totalCount})`,
      );

      return {
        users: plainToInstance(UserResponseDto, users),
        meta: {
          total: totalCount,
          page,
          limit,
          lastPage: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Gagal mengambil daftar user: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    this.logger.debug(`Mencari user dengan ID: ${id}`);

    const user = await this.userRepository.findOneById(id);
    if (!user) {
      this.logger.warn(`User dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return plainToInstance(UserResponseDto, user);
  }

  async findByRole(roleName: string): Promise<UserResponseDto[]> {
    this.logger.log(`Mencari users dengan role: ${roleName}`);

    const users = await this.userRepository.findMany({
      where: {
        roles: {
          some: {
            role: { name: roleName.toUpperCase() },
          },
        },
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    this.logger.log(`Ditemukan ${users.length} user dengan role ${roleName}`);
    return plainToInstance(UserResponseDto, users);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Proses update user ID: ${id}`);

    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      this.logger.warn(`Update gagal: User ID ${id} tidak ditemukan`);
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const { password, ...restData } = updateUserDto;
    const finalData: any = { ...restData };

    if (password) {
      this.logger.debug(`Mengupdate password untuk user ID: ${id}`);
      finalData.passwordHash = await bcrypt.hash(password, 10);
    }

    // Pastikan data password mentah tidak masuk ke repo
    delete finalData.password;

    try {
      const updatedUser = await this.userRepository.update(id, finalData);
      this.logger.log(`User ID: ${id} berhasil diperbarui`);
      return plainToInstance(UserResponseDto, updatedUser);
    } catch (error) {
      this.logger.error(`Gagal memperbarui user ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    this.logger.log(`Mencoba menghapus user ID: ${id}`);

    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      this.logger.warn(`Hapus gagal: User ID ${id} tidak ditemukan`);
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    try {
      const removedUser = await this.userRepository.remove(id);
      this.logger.log(`User ID: ${id} berhasil dihapus dari database`);
      return plainToInstance(UserResponseDto, removedUser);
    } catch (error) {
      this.logger.error(`Gagal menghapus user ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async adminCreateUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const { email, role } = createUserDto;
    this.logger.log(
      `Admin membuat user baru: ${email} sebagai ${role || 'KADER'}`,
    );

    try {
      const { password, role: roleInput, ...userData } = createUserDto;
      const passwordToHash = password || 'Password123!';
      const passwordHash = await bcrypt.hash(passwordToHash, 10);

      const createdUser = await this.userRepository.create({
        ...userData,
        passwordHash,
        role: roleInput ? roleInput.toUpperCase() : 'KADER',
      });

      this.logger.log(
        `User (Admin Created) berhasil dibuat dengan ID: ${createdUser.id}`,
      );
      return plainToInstance(UserResponseDto, createdUser);
    } catch (error) {
      this.logger.error(`Admin gagal membuat user: ${error.message}`);
      throw error;
    }
  }
}
