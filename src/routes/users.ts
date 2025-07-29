import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middlewares/auth';
import { urlRegex } from '../constants';
import validateRequest, { headersSchema } from '../middlewares/validateRequest';
import {
  login, createUser, getUsers, getUserById, getCurrentUser, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();

const userIdSchema = z.object({
  userId: z.string().length(24),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const fullUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200).optional(),
  avatar: z.string().regex(urlRegex).optional(),
});

const fullUserSchemaAvatarRequired = z.object({
  avatar: z.string().regex(urlRegex),
});

router.post('/signin', validateRequest(loginSchema, 'body'), login);
router.post('/signup', validateRequest(fullUserSchema, 'body'), createUser);

router.use(validateRequest(headersSchema, 'headers'), auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateRequest(userIdSchema, 'params'), getUserById);
router.patch('/me', validateRequest(fullUserSchema, 'body'), updateUser);
router.patch('/me/avatar', validateRequest(fullUserSchemaAvatarRequired, 'body'), updateUserAvatar);

export default router;
