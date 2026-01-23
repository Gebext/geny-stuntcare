import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaservice';

export type UserWithoutHash = Omit<User, 'passwordHash'>;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  private getUserSelect(): Prisma.UserSelect {
    return {
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
    };
  }

  async create(data: any): Promise<UserWithoutHash> {
    const { role, passwordHash, name, email, phone } = data;

    const roleMapping: Record<string, number> = {
      ADMIN: 1,
      KADER: 2,
      MOTHER: 3,
    };

    const targetRoleId = role ? roleMapping[role.toUpperCase()] || 3 : 3;

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
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
      select: this.getUserSelect(),
    });

    return user as unknown as UserWithoutHash;
  }

  async findAll(): Promise<UserWithoutHash[]> {
    return this.prisma.user.findMany({
      select: this.getUserSelect(),
    }) as unknown as UserWithoutHash[];
  }

  async findOneById(id: string): Promise<UserWithoutHash | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.getUserSelect(),
    }) as unknown as UserWithoutHash;
  }

  async update(id: string, data: any): Promise<UserWithoutHash> {
    // WHITELISTING: Hanya ambil field yang ada di kolom tabel User
    // Ini buat nyegah error "isActive/roles should not exist"
    const updateData: Prisma.UserUpdateInput = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.passwordHash) updateData.passwordHash = data.passwordHash;

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.getUserSelect(),
    });
    return user as unknown as UserWithoutHash;
  }

  async remove(id: string): Promise<UserWithoutHash> {
    return await this.prisma.$transaction(async (tx) => {
      // Hapus semua relasi biar gak error 500 Foreign Key
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.motherProfile.deleteMany({ where: { userId: id } });

      const user = await tx.user.delete({
        where: { id },
        select: { id: true, name: true, email: true },
      });

      return user as unknown as UserWithoutHash;
    });
  }

  async findMany(params: Prisma.UserFindManyArgs): Promise<UserWithoutHash[]> {
    const users = await this.prisma.user.findMany({
      ...params,
      select: this.getUserSelect(),
    });

    return users as unknown as UserWithoutHash[];
  }

  async findManyAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<[UserWithoutHash[], number]> {
    const { skip, take, where, orderBy } = params;

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: this.getUserSelect(),
      }),
      this.prisma.user.count({ where }),
    ]);

    return [users as unknown as UserWithoutHash[], totalCount];
  }
}
