import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.create({
      ...userData,
      passwordHash,
    });

    return plainToInstance(UserResponseDto, createdUser);
  }

  /**
   * Mengambil semua user dengan filter Role
   */
  async findAll(query: UserQueryDto): Promise<any> {
    const { page, limit, search, email, role } = query; // Destructure 'role' di sini
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // 1. Filtering by Email
    if (email) {
      where.email = email;
    }

    // 2. Searching (Name atau Email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 3. TAMBAHKAN: Filtering by Role
    if (role && role !== 'ALL') {
      where.roles = {
        some: {
          role: {
            name: role.toUpperCase(),
          },
        },
      };
    }

    // Dapatkan data dan total count
    const [users, totalCount] = await this.userRepository.findManyAndCount({
      skip,
      take: limit,
      where,
    });

    const lastPage = Math.ceil(totalCount / limit);

    return {
      users: plainToInstance(UserResponseDto, users),
      meta: {
        total: totalCount,
        page: page,
        limit: limit,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async findByRole(roleName: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: roleName.toUpperCase(),
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return plainToInstance(UserResponseDto, users);
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found.`);

    // 1. Pisahkan password mentah
    const { password, ...restData } = updateUserDto;
    const finalData: any = { ...restData };

    // 2. Jika ada password, hash dan masukkan ke field passwordHash
    if (password) {
      finalData.passwordHash = await bcrypt.hash(password, 10);
    }

    // 3. Pastikan field 'password' mentah dibuang agar tidak masuk ke repository
    delete finalData.password;

    const updatedUser = await this.userRepository.update(id, finalData);
    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found.`);

    const removedUser = await this.userRepository.remove(id);
    return plainToInstance(UserResponseDto, removedUser);
  }

  async adminCreateUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const { password, role, ...userData } = createUserDto;
    const passwordToHash = password || 'Password123!';
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    const createdUser = await this.userRepository.create({
      ...userData,
      passwordHash,
      role: role ? role.toUpperCase() : 'KADER',
    });

    return plainToInstance(UserResponseDto, createdUser);
  }
}
