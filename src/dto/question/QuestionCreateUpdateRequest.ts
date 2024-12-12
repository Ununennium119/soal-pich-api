import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min} from "class-validator";
import {Difficulty} from "../../enum/Difficulty";

export default class QuestionCreateUpdateRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4)
    title!: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    question!: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    option1!: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    option2!: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    option3!: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    option4!: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(4)
    answer!: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    category?: number;

    @IsEnum(Difficulty)
    difficulty!: Difficulty;

    @IsArray()
    @IsNumber({}, {each: true})
    @Min(1, {each: true})
    relatedQuestions!: number[];
}
