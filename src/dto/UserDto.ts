import {UserRole} from "../enum/UserRole";

export default class UserDto {
    id!: number;
    username!: string;
    role!: UserRole;
}
