import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../../errors/error';
import { UserRepo } from '../../repository/user/user.file.repo';
import { UserController } from './user.controller';

jest.mock('../../services/auth');
jest.mock('../../errors/error');

describe('Given the UserController', () => {
  const repo: UserRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    search: jest.fn(),
  };

  const mockUser = {
    email: 'test',
    password: 'test',
  };
  const req = {
    body: {},
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;

  const controller = new UserController(repo);

  describe('When register is called', () => {
    test('Then if there is no error from repo', async () => {
      (repo.create as jest.Mock).mockResolvedValueOnce(mockUser);

      await controller.register(req, resp, next);

      expect(repo.create).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalledWith({
        result: [mockUser],
      });
    });
  });

  describe('When register is called and email or pass are incorrect', () => {
    test('then it should throw an HTTPError', async () => {
      req.body = { email: '', password: '' };
      expect.assertions(1);
      try {
        await controller.register(req, resp, next);
      } catch (error) {
        expect(error).toMatchObject({
          status: 401,
          message: 'Invalid email or password',
        });
      }
    });

    test('logIn should return a token for valid credentials', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' },
      } as unknown as Request;
      const resp = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      await controller.logIn(req, resp, next);

      expect(next).not.toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalledTimes(1);
      expect(resp.json).toHaveBeenCalledWith(
        expect.objectContaining({
          results: expect.objectContaining({
            token: expect.any(String),
          }),
        })
      );
    });

    test('logIn should throw an error for invalid credentials', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'invalid' },
      } as unknown as Request;
      const resp = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      await controller.logIn(req, resp, next);

      expect(resp.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(HTTPError));
    });
  });
});
