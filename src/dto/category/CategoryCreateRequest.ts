import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export default class CategoryCreateRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4)
    title!: string;
}
