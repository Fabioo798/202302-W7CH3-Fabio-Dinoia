import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { CustomError } from './errors/error';

const debug = createDebug('W7CH3:app')

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

// App.use('/things', thingsRouter);
// app.use('/things/:id', thingsRouter);

app.use((error: CustomError, _req: Request, resp: Response, next: NextFunction) => {
  debug('error middleware');
  const status = error.statusCode || 500;
  const statusMessage = error.statusMessage || 'Internal server error';
  resp.json([
    {
      error: [
        {
          status, statusMessage
        },
      ],
    },
  ]);
  debug(status, statusMessage, error.message);
});
