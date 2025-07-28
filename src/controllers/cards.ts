import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const validateObjectId = (_id: string) => {
  try {
    return new mongoose.Types.ObjectId(_id);
  } catch (err) {
    throw new BadRequestError('Невалидный cardId');
  }
};

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate([
      { path: 'owner', select: '_id name about avatar' },
      { path: 'likes', select: '_id name about avatar' },
    ])
    .then((cards) => cards.map((card) => ({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      createdAt: card.createdAt,
    })))
    .then((cards) => res.send(cards))
    .catch(next);
};

export const deleteCardById = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId);

  return Card.findByIdAndDelete(objId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ messsage: 'Пост удалён' });
    })
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      createdAt: card.createdAt,
    }))
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId);

  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    objId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
      });
    })
    .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const objId = validateObjectId(cardId);

  const userId = req.user._id;

  return Card.findOneAndUpdate(
    objId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
      });
    })
    .catch(next);
};
