import { User } from '../../entities/user.js';
import { Repo } from '../../repository/repo.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../../errors/error.js';
import { Auth, PayLoadToken } from '../../services/auth.js';
import { debug } from 'util';

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register: post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'wrong credentials');
      req.body.password = await Auth.hash(req.body.password);
      const data = await this.repo.create(req.body);
      resp.json({
        result: [data],
      });
      console.log(data);
    } catch (error) {
      next(error);
    }
  }

  async logIn(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login: post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'wrong credentials');

      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Emailnot found');

      if (!Auth.compare(req.body.password, data[0].password))
        throw new HTTPError(401, 'Unauthorized', 'Password not matched');

      const payload: PayLoadToken = {
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.json({
        results: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
