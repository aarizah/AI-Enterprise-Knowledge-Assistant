import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    serviceTest(id:string){
        return id; 
    }

}
