import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { CustomError } from './errors/error.js';
import { charsRouter } from './router/char.router.js';
import { usersRouter } from './router/user.router.js';

const debug = createDebug('W7CH3:app');

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use('/chars', charsRouter);
app.use('/chars/:id', charsRouter);
app.use('/users', usersRouter)

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('error middleware');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.json([
      {
        error: [
          {
            status,
            statusMessage,
          },
        ],
      },
    ]);
    debug(status, statusMessage, error.message);
  }
);
