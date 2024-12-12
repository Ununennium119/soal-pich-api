import {IsNotEmpty, IsString, Length} from "class-validator";

export default class LoginRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
    username!: string;

    @IsString()
    @IsNotEmpty()
    @Length(4)
    password!: string;
}
