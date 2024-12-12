import {User} from '../models/User';
import UserDto from "../dto/UserDto";


declare global {
    namespace Express {
        interface Request {
            user?: UserDto
        }
    }
}
