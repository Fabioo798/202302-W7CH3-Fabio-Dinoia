import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { CharRepo } from '../repository/char.mongo.repo';

const debug = createDebug('W7: controller');

export class CharsController {
  constructor(public repo: CharRepo) {
    this.repo = repo;
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

  async post(req: Request, resp: Response, next: NextFunction) {
    debug('controller: post');
    try {
      const data = await this.repo.create(req.body);
      resp.json({
        results: [data],
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
      this.repo.destroy(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
