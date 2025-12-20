// src/modules/user/user.module.ts

import { Module } from '@nestjs/common';

import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule], 
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService], 
})
export class UserModule {}