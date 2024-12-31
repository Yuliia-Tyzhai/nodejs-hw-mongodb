import express from 'express';
import cors from 'cors';
import pino from 'pino-http';


import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';


export const setupServer = () => {
const app = express();

app.use(cors());
app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

app.use(contactsRouter);

app.use('*', notFoundHandler);

app.use((req, res) => {
    res.status(404).json({
        message: "Not found"
    });
});

const PORT = Number(getEnvVar('PORT', 3000));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};