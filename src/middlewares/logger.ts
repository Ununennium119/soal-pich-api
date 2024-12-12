import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, _: Response, next: NextFunction): void => {
    console.log(`${req.method} ${req.url} ${req.body}`);
    next();
};
