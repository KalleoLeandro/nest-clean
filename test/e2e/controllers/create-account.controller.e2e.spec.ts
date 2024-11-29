
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeAll, describe, test, expect } from 'vitest';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';


describe('Create account test', () => {

    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        prisma = moduleRef.get(PrismaService)

        app = moduleRef.createNestApplication();
        await app.init();
    });

    test('[POST]/accounts', async () => {
        const response = await request(app.getHttpServer()).post('/accounts').send({
            name: 'Teste User',
            email: 'teste@teste.com',
            password: '123456'
        });

        expect(response.statusCode).toEqual(201);

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: 'teste@teste.com'
            }
        });

        expect(userOnDatabase).toBeTruthy();
    });
});