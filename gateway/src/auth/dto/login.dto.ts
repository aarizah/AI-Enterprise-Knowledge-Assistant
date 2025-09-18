import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginRequest{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}