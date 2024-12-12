import {IsEnum, IsNotEmpty, IsString, Length} from "class-validator";
import {UserRole} from "../enum/UserRole";

export default class RegisterRequest {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
    username!: string;

    @IsString()
    @IsNotEmpty()
    @Length(4)
    password!: string;

    @IsEnum(UserRole)
    role!: UserRole;
}
