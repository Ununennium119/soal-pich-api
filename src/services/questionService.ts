import AppDataSource from "../config/datasource";
import Question from "../models/Question";
import QuestionCreateUpdateRequest from "../dto/question/QuestionCreateUpdateRequest";
import QuestionPageRequest from "../dto/question/QuestionPageRequest";
import Category from "../models/Category";
import {In} from "typeorm";
import PageResponse from "../dto/PageResponse";
import QuestionDto from "../dto/question/QuestionDto";

const questionRepository = AppDataSource.getRepository(Question)
const categoryRepository = AppDataSource.getRepository(Category)

export const serviceCreateQuestion = async (request: QuestionCreateUpdateRequest) => {
    const question = new Question();
    await updateFields(question, request);
    const createdQuestion = await questionRepository.save(question)
    return createdQuestion.toDto()
}

export const serviceGetQuestionById = async (id: number) => {
    const question = await questionRepository.findOne({
        where: {id: id},
        relations: ['category', 'relatedQuestions']
    })
    return question?.toDto()
}

export const serviceGetQuestionByTitle = async (title: string) => {
    const question = await questionRepository.findOne({
        where: {title: title},
        relations: ['category', 'relatedQuestions']
    })
    return question?.toDto()
}

export const serviceUpdateQuestion = async (id: number, request: QuestionCreateUpdateRequest) => {
    const question = await questionRepository.findOne({
        where: {id: id},
        relations: ['category', 'relatedQuestions']
    })
    if (!question) {
        throw new Error("No question found");
    }
    await updateFields(question, request);
    const updatedQuestion = await questionRepository.save(question)
    return updatedQuestion.toDto()
}

export const serviceDeleteQuestion = async (id: number) => {
    const question = await questionRepository.findOneBy({id: id})
    if (!question) {
        throw new Error("No question found");
    }
    await questionRepository.delete({id: id})
}

export const serviceListQuestions = async () => {
    const questions = await questionRepository.find({relations: ['category', 'relatedQuestions']})
    return questions.map((question) => {
        return question.toDto()
    })
}

export const servicePageQuestions = async (request: QuestionPageRequest) => {
    const queryBuilder = questionRepository.createQueryBuilder('questions')
    if (request.title) {
        queryBuilder.andWhere('questions.title ILIKE :title', {title: `%${request.title}%`})
    }
    console.log(request.category)
    if (request.category) {
        queryBuilder.andWhere('questions.category.id = :category', {category: request.category})
    }
    const [questions, total] = await queryBuilder
        .leftJoinAndSelect('questions.category', 'categories')
        .leftJoinAndSelect('questions.relatedQuestions', 'related_questions')
        .orderBy(`questions.${request.order}`, request.direction)
        .skip(request.page * request.pageSize)
        .take(request.pageSize)
        .getManyAndCount()

    const questionDtoList = questions.map((question) => {
        return question.toDto()
    })
    const response = new PageResponse<QuestionDto>();
    response.content = questionDtoList
    response.page = request.page
    response.total = total
    response.totalPages = Math.ceil(total / request.pageSize)
    return response
}

export const questionExistsById = async (id: number): Promise<boolean> => {
    return await questionRepository.findOneBy({id: id}) != null;
}

export const questionExistsByTitle = async (title: string): Promise<boolean> => {
    return await questionRepository.findOneBy({title: title}) != null;
}


const updateFields = async (question: Question, request: QuestionCreateUpdateRequest) => {
    const category = request.category ? await categoryRepository.findOneBy({id: request.category}) : undefined;
    const relatedQuestions = await questionRepository.find({where: {id: In(request.relatedQuestions)}});

    question.title = request.title;
    question.question = request.question;
    question.option1 = request.option1
    question.option2 = request.option2
    question.option3 = request.option3
    question.option4 = request.option4
    question.answer = request.answer
    question.category = category
    question.difficulty = request.difficulty
    question.relatedQuestions = relatedQuestions
}
