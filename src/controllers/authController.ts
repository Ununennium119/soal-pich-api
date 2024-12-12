import {Request, Response, NextFunction} from 'express';
import {validate} from "class-validator";
import {plainToInstance} from "class-transformer";
import RegisterRequest from "../dto/RegisterRequest";
import ValidationErrorList from "../dto/ValidationError";
import LoginRequest from "../dto/LoginRequest";
import {serviceLogin, serviceRegister} from "../services/authService";
import {userExists} from "../services/userService";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const registerRequest = plainToInstance(RegisterRequest, req.body);
        const errors = await validate(registerRequest);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        if (await userExists(registerRequest.username)) {
            const errors = new ValidationErrorList()
            errors.addError(
                registerRequest,
                'username',
                registerRequest.username,
                {'Unique': 'Username must be unique.'}
            )
            res.status(400).json(errors);
            return;
        }

        serviceRegister(registerRequest)

        res.status(201).json({message: 'User registered successfully!'});
        return;
    } catch (e) {
        next(e)
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginRequest = plainToInstance(LoginRequest, req.body);
        const errors = await validate(loginRequest);
        if (errors.length > 0) {
            res.status(400).json({errors});
            return;
        }

        const token = await serviceLogin(loginRequest);
        if (!token) {
            const errors = new ValidationErrorList()
            errors.addError(
                loginRequest,
                'username',
                loginRequest.password,
                {'Match': 'Username or password is invalid.'}
            )
            res.status(400).json(errors);
            return;
        }

        res.status(200).json({token});
        return;
    } catch (e) {
        next(e)
    }
};

export const currentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userDto = req.user
        res.status(200).json(userDto);
        return;
    } catch (e) {
        next(e)
    }
};
