import { Router } from 'express';
import {
  create,
  deleteOne,
  getAll,
  getOne,
  modify,
} from '../controllers/sauceController.js';
import auth from '../middleware/auth.js';
import Sauce from '../models/sauce.js';

const sauceRoutes = Router();

sauceRoutes.get('/' + '', auth, getAll);

sauceRoutes.get('/:id', auth, getOne);

sauceRoutes.post('/', auth, create);

sauceRoutes.put('/:id', auth, modify);

sauceRoutes.delete('/:id', auth, deleteOne);

export default sauceRoutes;
