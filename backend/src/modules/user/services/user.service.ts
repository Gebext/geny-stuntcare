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

  /**
   * Membuat user baru.
   * Langkah: 1. Pisahkan password. 2. Hash password. 3. Kirim ke Repository (tanpa password mentah).
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    // Repository akan otomatis set role ke MOTHER (ID 3) karena field 'role' kosong
    const createdUser = await this.userRepository.create({
      ...userData,
      passwordHash,
    });

    return plainToInstance(UserResponseDto, createdUser);
  }

  /**
   * Mengambil semua user.
   */
  async findAll(query: UserQueryDto): Promise<any> {
    const { page, limit, search, email } = query;
    const skip = (page - 1) * limit;

    // Prisma Where Clause Construction
    const where: Prisma.UserWhereInput = {};

    // 1. Filtering by Email
    if (email) {
      where.email = email;
    }

    // 2. Searching (Filter di Name atau Email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Dapatkan data dan total count secara bersamaan
    const [users, totalCount] = await this.userRepository.findManyAndCount({
      skip,
      take: limit,
      where,
    });

    // Hitung metadata
    const lastPage = Math.ceil(totalCount / limit);

    return {
      users: plainToInstance(UserResponseDto, users), // Data User yang bersih
      meta: {
        total: totalCount,
        page: page,
        limit: limit,
        lastPage: lastPage,
      },
    };
  }

  /**
   * Mengambil satu user berdasarkan ID.
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Transformasi objek tunggal
    return plainToInstance(UserResponseDto, user);
  }

  // Tambahkan fungsi ini di dalam class UserService
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
      // Kita sertakan include supaya data roles-nya tidak hilang saat di-transform
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

  /**
   * Mengupdate user. (Logika hash password jika password diubah)
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // --- Penanganan Error Not Found ---
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    // ------------------------------------

    let updatedData: any = updateUserDto; // Kita ubah tipe menjadi any sementara

    // Logika hashing password jika password diubah...
    if (updateUserDto.password) {
      const { password, ...restData } = updateUserDto;
      const passwordHash = await bcrypt.hash(password, 10);
      updatedData = { ...restData, passwordHash };
    } else {
      const { password, ...restData } = updateUserDto;
      updatedData = restData;
    }

    const updatedUser = await this.userRepository.update(id, updatedData);
    return plainToInstance(UserResponseDto, updatedUser);
  }

  /**
   * Menghapus user.
   */
  async remove(id: string): Promise<UserResponseDto> {
    // --- Penanganan Error Not Found ---
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    // ------------------------------------

    // Jika user ditemukan, lanjutkan penghapusan
    const removedUser = await this.userRepository.remove(id);
    return plainToInstance(UserResponseDto, removedUser);
  }

  async adminCreateUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    // 1. Destructuring password & role (ambil dari DTO)
    const { password, role, ...userData } = createUserDto;

    // 2. Hash password (dengan fallback default jika tidak diisi)
    const passwordToHash = password || 'Password123!';
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    // 3. Kirim ke Repository
    const createdUser = await this.userRepository.create({
      ...userData,
      passwordHash,
      // GANTI: Gunakan 'role' bukan 'roleName' agar sesuai destructuring di Repository
      role: role ? role.toUpperCase() : 'KADER',
    });

    return plainToInstance(UserResponseDto, createdUser);
  }
}
