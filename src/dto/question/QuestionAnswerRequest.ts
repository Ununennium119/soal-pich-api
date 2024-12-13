import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min} from "class-validator";
import {Difficulty} from "../../enum/Difficulty";

export default class QuestionAnswerRequest {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(4)
    answer!: number;
}
