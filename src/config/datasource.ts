import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../models/User';
import Category from "../models/Category";
import Question from "../models/Question";
import AnsweredQuestion from "../models/AnsweredQuestion";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE || 'soal_pich',
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'pass',
    synchronize: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [User, Category, Question, AnsweredQuestion],
});

export default AppDataSource;
