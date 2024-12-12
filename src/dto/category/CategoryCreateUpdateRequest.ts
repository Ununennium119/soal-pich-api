import {IsNotEmpty, IsString, Length} from "class-validator";

export default class CategoryCreateUpdateRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4)
    title!: string;
}
