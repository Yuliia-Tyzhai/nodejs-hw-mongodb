import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';


export const setupServer = () => {
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use("/auth", authRouter);
app.use(contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(getEnvVar('PORT', 3000));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};