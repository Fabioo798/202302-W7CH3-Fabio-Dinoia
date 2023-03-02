/* eslint-disable max-nested-callbacks */
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../../errors/error';
import { UserRepo } from '../../repository/user/user.file.repo';
import { Auth } from '../../services/auth';
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
    const req = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as Request;
    test('Then json should be called', async () => {
      await controller.register(req, resp, next);

      expect(resp.json).toHaveBeenCalled();
    });

    describe('and email or pass are incorrect', () => {
      test('then it should throw an HTTPError', async () => {
        await controller.register(req, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('Given a logIn function', () => {
    const req = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as Request;

    describe('When it is called and email and pass are <correct></correct>', () => {
      (repo.search as jest.Mock).mockResolvedValue(['test']);
      test('Then it should return a json response', async () => {
        await controller.logIn(req, resp, next);

        expect(resp.json).toHaveBeenCalled();
      });
    });

    describe('When it is called and email are incorrect', () => {
      const req = {
        body: {
          email: '',
          password: 'test',
        },
      } as Request;
      test('Then it should return a next response', async () => {
        await controller.logIn(req, resp, next);

        expect(next).toHaveBeenCalled();
      });
    });

    describe('When it is called and the password is not correct', () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
        },
      } as Request;
      test('Then it should return a next response', async () => {
        (repo.search as jest.Mock).mockResolvedValue({
          key: 'email',
          value: req.body.email,
        });
        Auth.compare = jest.fn().mockResolvedValue(false);
        await controller.logIn(req, resp, next);

        expect(next).toHaveBeenCalled();
      });
      test('Then it should return a next response', async () => {
        Auth.compare = jest.fn().mockResolvedValue(false);

        (repo.search as jest.Mock).mockResolvedValue(['test']);
        await controller.logIn(req, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    //   Test('logIn should return a token for valid credentials', async () => {
    //     const req = {
    //       body: { email: 'test@example.com', password: 'password123' },
    //     } as unknown as Request;
    //     const resp = { json: jest.fn() } as unknown as Response;
    //     const next = jest.fn();

    //     await controller.logIn(req, resp, next);

    //     expect(next).not.toHaveBeenCalled();
    //     expect(resp.json).toHaveBeenCalledTimes(1);
    //     expect(resp.json).toHaveBeenCalledWith(
    //       expect.objectContaining({
    //         results: expect.objectContaining({
    //           token: expect.any(String),
    //         }),
    //       })
    //     );
    //   });

    //   test('logIn should throw an error for invalid credentials', async () => {
    //     const req = {
    //       body: { email: 'test@example.com', password: 'invalid' },
    //     } as unknown as Request;
    //     const resp = { json: jest.fn() } as unknown as Response;
    //     const next = jest.fn();

    //     await controller.logIn(req, resp, next);

    //     expect(resp.json).not.toHaveBeenCalled();
    //     expect(next).toHaveBeenCalledTimes(1);
    //     expect(next).toHaveBeenCalledWith(expect.any(HTTPError));
    //   });
    // });
  });
});
