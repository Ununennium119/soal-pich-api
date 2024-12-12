export default class PageResponse<T> {
    content!: T[];
    page!: number;
    total!: number;
    totalPages!: number;
}
