import {IsNotEmpty, IsString, Length} from "class-validator";

export default class CategoryUpdateRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4)
    title!: string;
}
