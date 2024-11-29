
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeAll, describe, test, expect } from 'vitest';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';

describe('Create question test', () => {

    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        prisma = moduleRef.get(PrismaService)

        jwt = moduleRef.get(JwtService);

        app = moduleRef.createNestApplication();
        await app.init();
    });

    test('[POST]/questions', async () => {

        const user = await prisma.user.create({
            data: {
                name: 'Teste User',
                email: 'teste@teste.com',
                password: '123456'
            }
        });

        const access_token = jwt.sign({ sub: user.id });

        const response = await request(app.getHttpServer()).post('/questions')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
            title: 'Title test',
            content: 'Content test'
        });

        expect(response.statusCode).toEqual(201);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Title test'
            }
        });

        expect(questionOnDatabase).toBeTruthy();

    });
});