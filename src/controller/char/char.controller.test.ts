import { NextFunction, Request, Response } from 'express';
import { User } from '../../entities/user.js';
import { RequestPlus } from '../../interceptors/authentication.js';
import { CharRepo } from '../../repository/char/char.mongo.repo.js';
import { UserRepo } from '../../repository/user/user.file.repo';
import { CharsController } from './char.controller';

describe('Given the  CharController', () => {
  const repo: CharRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    search: jest.fn(),
  };
  const userRepo = {
    queryId: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  } as unknown as UserRepo;
  const req = {
    body: {
      id: '1',
    },
    params: { id: '1' },
  } as unknown as RequestPlus;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;

  const controller = new CharsController(repo, userRepo);

  describe('When getAll method is called', () => {
    test('Then if there is NO error from the repo', async () => {
      await controller.getAll(req, resp, next);

      expect(repo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is an error from the repo', async () => {
      (repo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);

      expect(repo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When get method is called', () => {
    test('Then if there is NO error from the repo', async () => {
      await controller.get(req, resp, next);

      expect(repo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is an error from the repo', async () => {
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.get(req, resp, next);

      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When post method is called', () => {
    test('Then if there is NO error from the repo', async () => {
      const req = {
        body: {},
        info: { id: '1' },
      } as unknown as RequestPlus;

      const resp = {
        json: jest.fn(),
      } as unknown as Response;

      (userRepo.queryId as jest.Mock).mockResolvedValue({ chars: [] });

      await controller.post(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is an error from the repo', async () => {
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.post(req, resp, next);

      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When patch method is called', () => {
    test('Then if there is NO error from the repo and the body`s id is different than params`ones', async () => {
      await controller.patch(req, resp, next);

      expect(repo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is an error from the repo', async () => {
      (repo.update as jest.Mock).mockRejectedValue(new Error());
      await controller.patch(req, resp, next);

      expect(repo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is NO error from the repo and the body`s id is the same than params`ones', async () => {
      const req = {
        body: {
          id: '3',
        },
        params: { id: '' },
      } as unknown as Request;

      await controller.patch(req, resp, next);

      expect(repo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When delete method is called', () => {
    test('Then if there is NO error from the repo', async () => {
      await controller.delete(req, resp, next);

      expect(repo.destroy).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is an error from the repo', async () => {
      (repo.destroy as jest.Mock).mockRejectedValue(new Error());
      await controller.delete(req, resp, next);

      expect(repo.destroy).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
