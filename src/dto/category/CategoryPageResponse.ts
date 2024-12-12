import CategoryDto from "./CategoryDto";

export default class CategoryPageResponse {
    content!: CategoryDto[];
    page!: number;
    total!: number;
    totalPages!: number;
}
