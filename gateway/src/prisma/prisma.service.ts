import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // abre el pool al iniciar la app
  }

  async onModuleDestroy() {
    await this.$disconnect(); // cierra el pool cuando se apaga
  }
}