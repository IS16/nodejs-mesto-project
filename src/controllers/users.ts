import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const validateObjectId = (_id: string) => {
  try {
    return new mongoose.Types.ObjectId(_id);
  } catch (err) {
    throw new BadRequestError('Невалидный userId');
  }
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => users.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    })))
    .then((users) => res.send(users))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const objId = validateObjectId(userId);

  return User.findById(objId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch(next);
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { $set: { name, about } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(next);
};

export const updateUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { $set: { avatar } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(next);
};
