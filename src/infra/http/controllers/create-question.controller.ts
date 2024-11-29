import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { TokenSchema } from "@/infra/auth/jwt.strategy";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Controller, HttpCode, Post, UseGuards, Body } from "@nestjs/common";

import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {

    constructor(private createQuestion: CreateQuestionUseCase) { }

    @Post()
    @HttpCode(201)
    async handle(@CurrentUser() user: TokenSchema,
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema) {

        const userId = user.sub;

        const { title, content } = body;
        await this.createQuestion.execute({
            title,
            content,            
            authorId: userId,
            attachmentsIds: []
        });        
    }

}