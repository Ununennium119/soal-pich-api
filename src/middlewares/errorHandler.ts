import {NextFunction, Request, Response} from 'express';

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong.',
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
    });
    next()
};
