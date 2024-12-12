import {IsEnum, IsNotEmpty, IsNumber, IsString, Min} from "class-validator";
import {OrderDirection} from "../enum/OrderDirection";

export default class PageRequest {
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    page: number = 0;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    pageSize: number = 10;

    @IsString()
    @IsNotEmpty()
    order: string = 'title';

    @IsEnum(OrderDirection)
    direction: OrderDirection = OrderDirection.ASC;
}