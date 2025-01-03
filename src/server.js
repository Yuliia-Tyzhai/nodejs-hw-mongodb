import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';


import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';


export const setupServer = () => {
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(getEnvVar('PORT', 3000));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};