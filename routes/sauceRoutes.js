import { Router } from 'express';
import {
  create,
  deleteOne,
  getAll,
  getOne,
  modify,
} from '../controllers/sauceController.js';

import auth from '../middleware/auth.js';
import multer from '../middleware/multer-config.js';

const sauceRoutes = Router();

sauceRoutes.get('/' + '', auth, getAll);

sauceRoutes.get('/:id', auth, getOne);

sauceRoutes.post('/', auth, multer, create);

sauceRoutes.put('/:id', auth, multer, modify);

sauceRoutes.delete('/:id', auth, deleteOne);

export default sauceRoutes;
