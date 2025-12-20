import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';

@Injectable()
export class MotherService {
  constructor(private prisma: PrismaService) {}

  async upsertProfile(userId: string, dto: CreateMotherProfileDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } }
  });

  const isMother = user.roles.some(ur => ur.role.name === 'MOTHER');
  if (!isMother) {
    throw new ForbiddenException('Hanya akun Ibu yang dapat memiliki profil klinis Ibu');
  }

  return this.prisma.motherProfile.upsert({
    where: { userId },
    update: { ...dto },
    create: { userId, ...dto },
  });
}
  async getProfile(userId: string) {
    const profile = await this.prisma.motherProfile.findUnique({
      where: { userId },
      include: { environment: true, childProfiles: true },
    });
    if (!profile) throw new NotFoundException('Profil belum diisi');
    return profile;
  }
}