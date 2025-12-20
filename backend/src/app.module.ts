import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MotherModule } from './modules/mother/mother.module';
import { ChildModule } from './modules/child/child.module';
import { AnthropometryModule } from './modules/anthropometry/anthropometry.module';
import { ImmunizationModule } from './modules/immunization/immunization.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    MotherModule,
    ChildModule,
    AnthropometryModule,
    ImmunizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
