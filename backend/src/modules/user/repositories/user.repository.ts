import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaservice';

export type UserWithoutHash = Omit<User, 'passwordHash'>;

type PrismaCreateData = Omit<
  Prisma.UserCreateInput,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'isActive'
  | 'roles'
  | 'motherProfile'
  | 'chatSessions'
> & {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role?: string; // Tambahkan ini agar Service bisa kirim string Role!
};

type PrismaUpdateData = Partial<PrismaCreateData>;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: PrismaCreateData): Promise<UserWithoutHash> {
    /**
     * 1. DESTRUCTURING:
     * Kita keluarkan 'role' agar tidak ikut masuk ke objek 'userData'.
     * 'userData' inilah yang nantinya aman dikirim ke Prisma.
     */
    const { role, ...userData } = data;

    // 2. MAPPING ROLE (Pastikan ID ini sesuai dengan tabel Role di DB-mu)
    const roleMapping: Record<string, number> = {
      ADMIN: 1,
      KADER: 2,
      MOTHER: 3,
    };

    /**
     * 3. PENENTUAN TARGET ROLE:
     * - Jika 'role' dikirim (jalur Admin), ambil dari mapping.
     * - Jika tidak dikirim (jalur Register Mother), otomatis jadi ID 3 (MOTHER).
     */
    const targetRoleId = role ? roleMapping[role.toUpperCase()] || 3 : 3;

    // 4. EKSEKUSI KE DATABASE
    const user = await this.prisma.user.create({
      data: {
        ...userData, // Bersih dari field 'role'
        roles: {
          create: [
            {
              role: {
                connect: { id: targetRoleId },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        motherProfile: true,
        chatSessions: true,
      },
    });

    return user as unknown as UserWithoutHash;
  }

  async findAll(): Promise<UserWithoutHash[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        motherProfile: true,
        chatSessions: true,
      },
    });
    return users as UserWithoutHash[];
  }

  async findOneById(id: string): Promise<UserWithoutHash | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        motherProfile: true,
        chatSessions: true,
      },
    });
    return user as UserWithoutHash;
  }

  async update(id: string, data: PrismaUpdateData): Promise<UserWithoutHash> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        motherProfile: true,
        chatSessions: true,
      },
    });
    return user as UserWithoutHash;
  }

  async remove(id: string): Promise<UserWithoutHash> {
    const user = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
        motherProfile: true,
        chatSessions: true,
      },
    });
    return user as UserWithoutHash;
  }

  // Di dalam class UserRepository

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude; // Tambahkan ini supaya bisa include Roles
  }): Promise<any[]> {
    return this.prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: params.include, // Ini yang bikin kita bisa narik data Role
    });
  }

  async findManyAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<[UserWithoutHash[], number]> {
    const { skip, take, where, orderBy } = params;

    const userSelect: Prisma.UserSelect = {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      roles: true,
      motherProfile: true,
      chatSessions: true,
    };

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: userSelect,
      }),
      this.prisma.user.count({ where }),
    ]);

    return [users as UserWithoutHash[], totalCount];
  }
}
