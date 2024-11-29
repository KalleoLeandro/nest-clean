import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class QuestionPresenter {
    static toHTTP(question: Question) {
        return {
            id: question.id.toString(),
            title: question.title,            
            slug: question.slug,
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt
        }
    }
}