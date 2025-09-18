import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UsersController {
    constructor (private readonly userService:UsersService){}

    @UseGuards(AuthGuard('jwt'))
    @Get("me")
    get_me(){
        return "Congratulations! You are authenticated.";
    }
}
