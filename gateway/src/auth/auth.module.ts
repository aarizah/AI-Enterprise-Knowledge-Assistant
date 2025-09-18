import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: config.get('SECRET_KEY'),
      signOptions: { expiresIn: config.get('ACCESS_TOKEN_EXPIRE', '15m') },
    }),
  })
  ],
})
export class AuthModule {}
