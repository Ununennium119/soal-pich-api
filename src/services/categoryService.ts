import AppDataSource from "../config/datasource";
import Category from "../models/Category";
import CategoryCreateUpdateRequest from "../dto/category/CategoryCreateUpdateRequest";
import CategoryPageRequest from "../dto/category/CategoryPageRequest";
import PageResponse from "../dto/PageResponse";
import CategoryDto from "../dto/category/CategoryDto";

const categoryRepository = AppDataSource.getRepository(Category)

export const serviceCreateCategory = async (request: CategoryCreateUpdateRequest) => {
    const category = new Category();
    category.title = request.title;
    const createdCategory = await categoryRepository.save(category)
    return createdCategory.toDto()
}

export const serviceGetCategoryById = async (id: number) => {
    const category = await categoryRepository.findOneBy({id: id})
    return category?.toDto()
}

export const serviceGetCategoryByTitle = async (title: string) => {
    const category = await categoryRepository.findOneBy({title: title})
    return category?.toDto()
}

export const serviceUpdateCategory = async (id: number, request: CategoryCreateUpdateRequest) => {
    const category = await categoryRepository.findOneBy({id: id})
    if (!category) {
        throw new Error("No category found");
    }
    category.title = request.title;
    const updatedCategory = await categoryRepository.save(category)
    return updatedCategory.toDto()
}

export const serviceDeleteCategory = async (id: number) => {
    const category = await categoryRepository.findOneBy({id: id})
    if (!category) {
        throw new Error("No category found");
    }
    await categoryRepository.delete({id: id})
}

export const serviceListCategories = async () => {
    const categories = await categoryRepository.find()
    return categories.map((category) => {
        return category.toDto()
    })
}

export const servicePageCategories = async (request: CategoryPageRequest) => {
    const queryBuilder = categoryRepository.createQueryBuilder('categories')
    if (request.title) {
        queryBuilder.where('categories.title ILIKE :title', {title: `%${request.title}%`})
    }
    const [categories, total] = await queryBuilder
        .orderBy(request.order, request.direction)
        .skip(request.page * request.pageSize)
        .take(request.pageSize)
        .getManyAndCount()

    const categoryDtoList = categories.map((category) => {
        return category.toDto()
    })
    const response = new PageResponse<CategoryDto>();
    response.content = categoryDtoList
    response.page = request.page
    response.total = total
    response.totalPages = Math.ceil(total / request.pageSize)
    return response
}

export const categoryExistsById = async (id: number): Promise<boolean> => {
    return await categoryRepository.findOneBy({id: id}) != null;
}

export const categoryExistsByTitle = async (title: string): Promise<boolean> => {
    return await categoryRepository.findOneBy({title: title}) != null;
}
