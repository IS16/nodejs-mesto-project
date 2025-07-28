import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('6886a8eccd2fcf81dd4f919b'),
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Server starts at port ${PORT}`);
});
