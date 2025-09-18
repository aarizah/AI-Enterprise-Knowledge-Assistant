import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { PasswordService } from './password/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private passwordService: PasswordService, private jwtService: JwtService) { }

    async register(data: RegisterRequest)
    {
        const hashedPassword = await this.passwordService.hashPassword(data.password);
        const user = await this.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            },
        });

        return { message: 'Registration successful' };
    }


    async login(data: LoginRequest) {

        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user || !(await this.passwordService.verifyPassword(data.password, user.password))) {
            return { message: 'Invalid credentials' };
        }
        const payload = { email: user.email, sub: user.id, username: user.username };
        const token = this.jwtService.sign(payload);
        return { message: 'Login successful', token };
    }
}
