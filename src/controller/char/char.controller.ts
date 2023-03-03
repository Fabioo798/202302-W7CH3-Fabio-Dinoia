import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { HTTPError } from '../../errors/error.js';
import { UserRepo } from '../../repository/user/user.file.repo.js';
import { CharRepo } from '../../repository/char/char.mongo.repo.js';
import { RequestPlus } from '../../interceptors/authentication.js';

const debug = createDebug('W7: controller');

export class CharsController {
  constructor(public repo: CharRepo, public repoUser: UserRepo) {
    this.repo = repo;
    this.repoUser = repoUser;
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    debug('controller: getAll');
    try {
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    debug('controller: get');
    try {
      const data = await this.repo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('controller: post');
      const userId = req.info?.id; // Creo constante id desde el token
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id'); // Check if id exist
      const actualUser = await this.repoUser.queryId(userId); // Call query to search
      req.body.owner = userId; // Anado el id en el body del owner

      const newChar = await this.repo.create(req.body); // Creo en el repo de char un char (con lo que nos ha llegado) y que nos la devuelva
      actualUser.chars.push(newChar); // Pusheo el nuevo char(objecto) en el array de chars del usuario
      await this.repoUser.update(actualUser); // Actualiza la base de datos
      resp.json({
        results: [newChar],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    debug('controller: patch');
    try {
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    debug('delete');
    try {
      const paramId = req.params.id;
      await this.repo.destroy(paramId);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
