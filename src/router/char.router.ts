import { Router } from 'express';
import { CharsController } from '../controller/char/char.controller.js';
import { logged } from '../interceptors/authentication.js';
import { authorized } from '../interceptors/authorization.js';
import { CharRepo } from '../repository/char/char.mongo.repo.js';
import { UserRepo } from '../repository/user/user.file.repo.js';

// eslint-disable-next-line new-cap
export const charsRouter = Router();
const repo = new CharRepo();
const repoUsers = new UserRepo();
const controller = new CharsController(repo, repoUsers);

charsRouter.get('/', logged, controller.getAll.bind(controller));
charsRouter.get('/:id', logged, controller.get.bind(controller));
charsRouter.post('/', logged, controller.post.bind(controller));
charsRouter.patch(
  '/:id',
  logged,
  authorized,
  controller.patch.bind(controller)
);
charsRouter.delete(
  '/:id',
  logged,
  authorized,
  controller.delete.bind(controller)
);
