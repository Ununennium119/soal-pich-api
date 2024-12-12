import express, { Application, Request, Response } from 'express';
import indexRouter from './routes/index';
import { logger } from './middlewares/logger';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

app.get('/health', (_: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/', indexRouter);

export default app;
