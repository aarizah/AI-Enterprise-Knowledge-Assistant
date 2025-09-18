import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

@Post('register')
register(@Body() data: RegisterRequest) {
    return this.authService.register(data);
  }


@Post('login')
login(@Body() data: LoginRequest) {
    return this.authService.login(data);
  }

}

