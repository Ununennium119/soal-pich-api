import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import ValidationErrorList from "../dto/ValidationError";
import QuestionCreateUpdateRequest from "../dto/question/QuestionCreateUpdateRequest";
import {
    questionExistsById,
    questionExistsByTitle,
    serviceCreateQuestion,
    serviceDeleteQuestion,
    serviceGetQuestionById,
    serviceGetQuestionByTitle,
    serviceListQuestions,
    servicePageQuestions,
    serviceUpdateQuestion
} from "../services/questionService";
import QuestionPageRequest from "../dto/question/QuestionPageRequest";
import {OrderDirection} from "../enum/OrderDirection";
import {categoryExistsById} from "../services/categoryService";

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const request = plainToInstance(QuestionCreateUpdateRequest, req.body);
        const errors = await validate(request);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        if (await questionExistsByTitle(request.title)) {
            const errors = new ValidationErrorList()
            errors.addError(
                request,
                'title',
                request.title,
                {'Unique': 'Title must be unique.'}
            )
            res.status(400).json(errors);
            return;
        }

        if (request.category && !await categoryExistsById(request.category)) {
            const errors = new ValidationErrorList()
            errors.addError(
                request,
                'category',
                request.category,
                {'Exist': 'Category does not exist.'}
            )
            res.status(400).json(errors);
            return;
        }

        const question = await serviceCreateQuestion(request)

        res.status(201).json(question);
        return;
    } catch (e) {
        next(e)
    }
};

export const getQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const question = await serviceGetQuestionById(parseInt(id));
        if (!question) {
            res.status(404).send();
            return;
        }
        res.status(200).json(question);
        return;
    } catch (e) {
        next(e)
    }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const request = plainToInstance(QuestionCreateUpdateRequest, req.body);
        const errors = await validate(request);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        const {id} = req.params;
        const parsedId = parseInt(id)

        if (!id || !await questionExistsById(parsedId)) {
            res.status(404).send();
            return;
        }

        const question = await serviceGetQuestionByTitle(request.title);
        if (question && question.id != parsedId) {
            const errors = new ValidationErrorList()
            errors.addError(
                request,
                'title',
                request.title,
                {'Unique': 'Title must be unique.'}
            )
            res.status(400).json(errors);
            return;
        }

        const updatedQuestion = await serviceUpdateQuestion(parsedId, request)

        res.status(200).json(updatedQuestion);
        return;
    } catch (e) {
        next(e)
    }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const parsedId = parseInt(id)
        if (!parsedId || !await questionExistsById(parsedId)) {
            res.status(404).send();
            return;
        }
        await serviceDeleteQuestion(parsedId)
        res.status(204).send();
        return;
    } catch (e) {
        next(e)
    }
};

export const listQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {title, category, page, pageSize, order, direction} = req.query;
        const parsedPage = page ? parseInt(page as string) : null;
        if (parsedPage == null) {
            const questions = await serviceListQuestions()
            res.status(200).json(questions);
            return;
        }

        const parsedPageSize = pageSize ? parseInt(pageSize as string) : null;
        const parsedCategory = category ? parseInt(category as string) : null;
        const request = new QuestionPageRequest()
        if (title) {
            request.title = title.toString()
        }
        if (parsedCategory || parsedCategory == 0) {
            request.category = parsedCategory
        }
        request.page = parsedPage
        if (parsedPageSize) {
            request.pageSize = parsedPageSize
        }
        if (order) {
            request.order = order.toString();
        }
        if (direction) {
            request.direction = direction.toString() as OrderDirection;
        }

        const errors = await validate(request);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        const questions = await servicePageQuestions(request)
        res.status(200).json(questions);
        return;
    } catch (e) {
        next(e)
    }
};
