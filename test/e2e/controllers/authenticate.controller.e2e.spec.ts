import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeAll, describe, test, expect } from 'vitest';
import { hash } from 'bcryptjs';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('authenticate test', () => {

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

    test('[POST]/sessions', async () => {

        await prisma.user.create({
            data: {
                name: 'Teste User',
                email: 'teste@teste.com',
                password: await hash('123456', 8)
            }
        });

        const response = await request(app.getHttpServer()).post('/sessions').send({
            email: 'teste@teste.com',
            password: '123456'
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            access_token: expect.any(String)
        });
    });
});