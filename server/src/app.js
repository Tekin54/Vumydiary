import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import defaultRouter from './api/routes/index.js';
import { errorHandler, notFoundHandler } from './error/errorHandler.js';

dotenv.config();
const dirName = path.resolve();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(dirName, 'public')));

app.use('/api', defaultRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5555;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log('Server started');
