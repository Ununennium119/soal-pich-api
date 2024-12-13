import AppDataSource from "../config/datasource";
import Question from "../models/Question";
import QuestionCreateUpdateRequest from "../dto/question/QuestionCreateUpdateRequest";
import QuestionPageRequest from "../dto/question/QuestionPageRequest";
import Category from "../models/Category";
import {In} from "typeorm";
import PageResponse from "../dto/PageResponse";
import QuestionDto from "../dto/question/QuestionDto";
import AnsweredQuestion from "../models/AnsweredQuestion";
import {Difficulty} from "../enum/Difficulty";
import AnsweredQuestionDto from "../dto/question/AnsweredQuestionDto";
import PageRequest from "../dto/PageRequest";
import ScoreboardRowDto from "../dto/ScoreboardRowDto";
import User from "../models/User";

const questionRepository = AppDataSource.getRepository(Question)
const categoryRepository = AppDataSource.getRepository(Category)
const answeredQuestionRepository = AppDataSource.getRepository(AnsweredQuestion)
const userRepository = AppDataSource.getRepository(User)

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

export const getRandomUnansweredQuestion = async (userId: number, category?: number): Promise<number | null> => {
    const answeredQuestionIds = await answeredQuestionRepository
        .createQueryBuilder('answered_questions')
        .select('answered_questions.question_id', 'questionId')
        .andWhere('answered_questions.user_id = :userId', { userId })
        .getRawMany();
    const answeredIds = answeredQuestionIds.map((aq) => aq.questionId);

    const queryBuilder = questionRepository.createQueryBuilder('question')
        .select('question.id')
        .where('question.id NOT IN (:...answeredIds)', {answeredIds: answeredIds.length > 0 ? answeredIds : [0]});
    if (category || category === 0) {
        queryBuilder.andWhere('question.category.id = :category', {category});
    }
    const unansweredQuestions = await queryBuilder.getMany();
    if (unansweredQuestions.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
    return unansweredQuestions[randomIndex].id;
}

export const submitAnswer = async (userId: number, questionId: number, selectedAnswer: number): Promise<AnsweredQuestionDto> => {
    const question = await questionRepository.findOne({where: {id: questionId}});
    if (!question) {
        throw new Error('Question not found');
    }

    const existingAnswer = await answeredQuestionRepository.findOne({
        where: {
            user: {id: userId},
            question: {id: questionId}
        }
    });
    if (existingAnswer) {
        throw new Error('User has already answered this question');
    }

    const isCorrect = question.answer === selectedAnswer;
    let difficultyScore = 0;
    switch (question.difficulty) {
        case Difficulty.EASY:
            difficultyScore = 10;
            break;
        case Difficulty.NORMAL:
            difficultyScore = 20;
            break
        case Difficulty.HARD:
            difficultyScore = 30;
            break;
    }
    const score = isCorrect ? difficultyScore : 0
    const answeredQuestion = answeredQuestionRepository.create({
        user: {id: userId},
        question: {id: questionId},
        selectedAnswer,
        score,
    } as AnsweredQuestion);

    return (await answeredQuestionRepository.save(answeredQuestion)).toDto();
}

export const isQuestionAnswered = async (userId: number, questionId: number): Promise<boolean> => {
    const count = await answeredQuestionRepository
        .createQueryBuilder('answered_questions')
        .andWhere('answered_questions.user_id = :userId', { userId })
        .andWhere('answered_questions.question_id = :questionId', { questionId })
        .getCount();

    return count > 0;
}

export const serviceGetScoreboard = async (request: PageRequest): Promise<PageResponse<ScoreboardRowDto>> => {
    const scores = await answeredQuestionRepository
        .createQueryBuilder('answered_questions')
        .select('answered_questions.user_id', 'userId')
        .addSelect('SUM(answered_questions.score)', 'score')
        .groupBy('answered_questions.user_id')
        .orderBy('score', 'DESC')
        .getRawMany();
    const paginatedScores = scores.slice(request.page * request.pageSize, (request.page + 1) * request.pageSize);
    const content = await Promise.all(paginatedScores.map(async (entry, index) => {
        const user = await userRepository.findOneBy({id: entry.userId});
        const row = new ScoreboardRowDto();
        row.rank = request.page * request.pageSize + index + 1;
        row.username = user?.username!;
        row.score = entry.score;
        return row;
    }));

    const response = new PageResponse<ScoreboardRowDto>();
    response.content = content;
    response.page = request.page;
    response.totalPages = Math.ceil(scores.length / request.pageSize)
    response.total = scores.length;
    return response;
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
