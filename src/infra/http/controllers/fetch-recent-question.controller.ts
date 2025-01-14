import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { Controller, HttpCode, UseGuards, Get, Query } from "@nestjs/common";

import { z } from 'zod';
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {

    constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) { }

    @Get()
    @HttpCode(200)
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
        const perPage = 20;

        const result = await this.fetchRecentQuestions.execute({
            page
        });

        if(result.isLeft()){
            throw new Error();
        }            

        const questions = result.value.questions;

        return { questions: questions.map(QuestionPresenter.toHTTP) }
    }
}