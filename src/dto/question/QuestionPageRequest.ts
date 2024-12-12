import {IsNumber, IsOptional, IsString, Min} from "class-validator";
import PageRequest from "../PageRequest";

export default class QuestionPageRequest extends PageRequest{
    @IsString()
    title: string = '';

    @IsOptional()
    @IsNumber()
    @Min(1)
    category?: number;
}
