import { Router } from 'express';
import { UserController } from '../controller/user/user.controller.js';
import { UserRepo } from '../repository/user/user.file.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();
const repo = new UserRepo();
const controller = new UserController(repo);

usersRouter.post('/login', controller.logIn.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
