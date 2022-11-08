import { Router } from 'express';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  modifyOne,
  likeOne,
} from '../controllers/sauceController.js';

import auth from '../middleware/auth.js';
import multer from '../middleware/multer-config.js';

const sauceRoutes = Router();

sauceRoutes.get('/' + '', auth, getAll);

sauceRoutes.get('/:id', auth, getOne);

sauceRoutes.post('/', auth, multer, createOne);

sauceRoutes.put('/:id', auth, multer, modifyOne);

sauceRoutes.post('/:id/like', auth, likeOne);

sauceRoutes.delete('/:id', auth, deleteOne);

export default sauceRoutes;
