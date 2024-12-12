import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import UserDto from "../dto/UserDto";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied: No token provided.' });
        return;
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET) as UserDto
        const userDto = new UserDto()
        userDto.id = decodedToken.id
        userDto.username = decodedToken.username
        userDto.role = decodedToken.role
        req.user = userDto;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
        return;
    }
};

export default authenticateJWT;
