import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    UsersModule, AuthModule, PrismaModule, SecurityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
