import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentRepository } from "./prisma/repositories/prisma-questions-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answer-attachment-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        PrismaQuestionsRepository, PrismaQuestionAttachmentRepository, PrismaQuestionCommentsRepository,
        PrismaAnswerRepository, PrismaAnswerCommentRepository, PrismaAnswerAttachmentRepository
    ],
    exports: [PrismaService,
        QuestionsRepository, PrismaQuestionAttachmentRepository, PrismaQuestionCommentsRepository,
        PrismaAnswerRepository, PrismaAnswerCommentRepository, PrismaAnswerAttachmentRepository
    ]
})
export class DatabaseModule { }