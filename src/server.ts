import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import 'reflect-metadata';
import AppDataSource from "./config/datasource";


const PORT = process.env.PORT || 3000;
const DB_SYNC = process.env.DB_SYNC === 'true';

const startServer = async () => {
    try {
        console.info('Connecting to database.');
        await AppDataSource.initialize();
        console.info('Database connected successfully.');

        if (DB_SYNC) {
            console.info('Creating database entities...')
            await AppDataSource.synchronize();
            console.info('Database entities created successfully.')
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }

    app.listen(PORT, () => {
        console.info(`Server running on port ${PORT}...`);
    });
};

startServer();
