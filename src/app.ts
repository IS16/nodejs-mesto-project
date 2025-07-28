import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { HttpStatusCode, DEFAULT_SERVER_ERROR } from './utils/http-status-codes';
import routes from './routes';

const express = require('express');

const { PORT = 3000 } = process.env;
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

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('6886a8eccd2fcf81dd4f919b'),
  };

  next();
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = HttpStatusCode.InternalServerError, message } = err;

  res.status(statusCode).send({
    message: statusCode === HttpStatusCode.InternalServerError
      ? DEFAULT_SERVER_ERROR
      : message,
  });
  next();
});
