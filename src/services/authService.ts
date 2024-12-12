import RegisterRequest from "../dto/RegisterRequest";
import bcrypt from "bcrypt";
import User from "../models/User";
import AppDataSource from "../config/datasource";
import LoginRequest from "../dto/LoginRequest";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const userRepository = AppDataSource.getRepository(User)
const SALT_ROUNDS = 10

export const serviceRegister = async (request: RegisterRequest): Promise<void> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(request.password, salt);

    const user = new User();
    user.username = request.username;
    user.password = hashedPassword
    user.role = request.role;
    await AppDataSource.getRepository(User).save(user);
}

export const serviceLogin = async (request: LoginRequest): Promise<String | null> => {
    const user = await userRepository.findOneBy({username: request.username});
    if (!user) {
        return null;
    }
    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    return jwt.sign(
        {id: user.id, username: user.username, role: user.role},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRATION}
    );
}
