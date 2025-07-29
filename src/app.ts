import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import { HttpStatusCode, DEFAULT_SERVER_ERROR } from './utils/http-status-codes';
import { requestLogger, errorLogger } from './middlewares/logger';
import routes from './routes';

const express = require('express');

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-shadow, no-unused-vars
  interface Request {
    user: {
      _id: Types.ObjectId;
    };
  }
}

const { PORT = 4000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server starts at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = HttpStatusCode.InternalServerError, message } = err;

  res.status(statusCode).send({
    message: statusCode === HttpStatusCode.InternalServerError
      ? DEFAULT_SERVER_ERROR
      : message,
  });
  next();
});
