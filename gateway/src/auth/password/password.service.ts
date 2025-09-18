import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';


@Injectable()
export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
