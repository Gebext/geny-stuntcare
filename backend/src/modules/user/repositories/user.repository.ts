import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaservice';

export type UserWithoutHash = Omit<User, 'passwordHash'>;

type PrismaCreateData = Omit<Prisma.UserCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'roles' | 'motherProfile' | 'chatSessions'> & {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
};

type PrismaUpdateData = Partial<PrismaCreateData>;


@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: PrismaCreateData): Promise<UserWithoutHash> {
  const DEFAULT_ROLE_ID = 3; 

  const user = await this.prisma.user.create({
    data: {
      ...data,
      roles: {
        create: [
          {
            role: {
              connect: { id: DEFAULT_ROLE_ID }
            }
          }
        ]
      }
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
              name: true
            }
          }
        }
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