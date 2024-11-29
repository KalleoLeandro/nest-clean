
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeAll, describe, test, expect } from 'vitest';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';

describe('Fetch recent questions test', () => {

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

    test('[GET]/questions', async () => {

        const user = await prisma.user.create({
            data: {
                name: 'Teste User',
                email: 'teste@teste.com',
                password: '123456'
            }
        });

        const access_token = jwt.sign({ sub: user.id });

        await prisma.question.createMany({
            data: [
                {
                    title: 'Question 01',
                    content: 'Question 01',
                    slug: 'question-01',
                    authorId: user.id
                },
                {
                    title: 'Question 02',
                    content: 'Question 02',
                    slug: 'question-02',
                    authorId: user.id
                },
                {
                    title: 'Question 03',
                    content: 'Question 03',
                    slug: 'question-03',
                    authorId: user.id
                }
            ]
        })

        const response = await request(app.getHttpServer()).get('/questions')
        .set('Authorization', `Bearer ${access_token}`)
        .send();

        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({title: 'Question 01'}),
                expect.objectContaining({title: 'Question 02'}),
                expect.objectContaining({title: 'Question 03'})
            ]
        })
        
    });
});