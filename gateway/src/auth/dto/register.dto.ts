import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterRequest{
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}