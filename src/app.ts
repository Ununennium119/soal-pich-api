import express, { Application, Request, Response } from 'express';
import indexRouter from './routes/indexRouter';
import { logger } from './middlewares/logger';
import {errorHandler} from "./middlewares/errorHandler";
import categoryRouter from "./routes/categoryRouter";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(errorHandler);

app.use('/', indexRouter);
app.use('/categories', categoryRouter);

app.get('/health', (_: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

export default app;
