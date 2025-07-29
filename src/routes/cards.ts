import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middlewares/auth';
import { urlRegex } from '../constants';
import validateRequest, { headersSchema } from '../middlewares/validateRequest';
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

const cardIdSchema = z.object({
  cardId: z.string().length(24),
});

const cardSchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().regex(urlRegex),
});

router.use(validateRequest(headersSchema, 'headers'), auth);

router.get('/', getCards);
router.post('/', validateRequest(cardSchema, 'body'), createCard);
router.delete('/:cardId', validateRequest(cardIdSchema, 'params'), deleteCardById);
router.put('/:cardId/likes', validateRequest(cardIdSchema, 'params'), likeCard);
router.delete('/:cardId/likes', validateRequest(cardIdSchema, 'params'), dislikeCard);

export default router;
