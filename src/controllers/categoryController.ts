import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import ValidationErrorList from "../dto/ValidationError";
import CategoryCreateRequest from "../dto/category/CategoryCreateRequest";
import {
    categoryExistsById,
    categoryExistsByTitle,
    serviceCreateCategory,
    serviceDeleteCategory,
    serviceGetCategoryById,
    serviceGetCategoryByTitle,
    serviceListCategories,
    servicePageCategories,
    serviceUpdateCategory
} from "../services/categoryService";
import CategoryUpdateRequest from "../dto/category/CategoryUpdateRequest";
import CategoryPageRequest from "../dto/category/CategoryPageRequest";
import {OrderDirection} from "../enum/OrderDirection";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const request = plainToInstance(CategoryCreateRequest, req.body);
        const errors = await validate(request);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        if (await categoryExistsByTitle(request.title)) {
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

        const category = await serviceCreateCategory(request)

        res.status(201).json(category);
        return;
    } catch (e) {
        next(e)
    }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const category = await serviceGetCategoryById(parseInt(id));
        if (!category) {
            res.status(404).send();
            return;
        }
        res.status(200).json(category);
        return;
    } catch (e) {
        next(e)
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const request = plainToInstance(CategoryUpdateRequest, req.body);
        const errors = await validate(request);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        const {id} = req.params;
        const parsedId = parseInt(id)

        if (!id || !await categoryExistsById(parsedId)) {
            res.status(404).send();
            return;
        }

        const category = await serviceGetCategoryByTitle(request.title);
        if (category && category.id != parsedId) {
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

        const updatedCategory = await serviceUpdateCategory(parsedId, request)

        res.status(200).json(updatedCategory);
        return;
    } catch (e) {
        next(e)
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const parsedId = parseInt(id)
        if (!parsedId || !await categoryExistsById(parsedId)) {
            res.status(404).send();
            return;
        }
        await serviceDeleteCategory(parsedId)
        res.status(204).send();
        return;
    } catch (e) {
        next(e)
    }
};

export const listCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {title, page, pageSize, order, direction} = req.query;
        const parsedPage = page ? parseInt(page as string) : null;
        if (parsedPage == null) {
            const categories = await serviceListCategories()
            res.status(200).json(categories);
            return;
        }

        const parsedPageSize = pageSize ? parseInt(pageSize as string) : null;
        const request = new CategoryPageRequest()
        if (title) {
            request.title = title.toString()
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

        const categories = await servicePageCategories(request)
        res.status(200).json(categories);
        return;
    } catch (e) {
        next(e)
    }
};
