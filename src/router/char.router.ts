import { Router } from 'express';
import { CharsController } from '../controller/char.controller.js';
import { CharRepo } from '../repository/char.mongo.repo.js';

// eslint-disable-next-line new-cap
export const charsRouter = Router();
const repo = new CharRepo();
const controller = new CharsController(repo);

charsRouter.get('/', controller.getAll.bind(controller));
charsRouter.get('/:id', controller.get.bind(controller));
charsRouter.post('/', controller.post.bind(controller));
charsRouter.patch('/:id', controller.patch.bind(controller));
charsRouter.delete('/:id', controller.delete.bind(controller));
