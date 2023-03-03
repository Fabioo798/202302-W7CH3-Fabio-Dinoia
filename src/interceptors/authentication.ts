import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/error.js';
import { Auth, PayLoadToken } from '../services/auth.js';

export interface RequestPlus extends Request {
  info?: PayLoadToken;
}
export function logged(req: RequestPlus, resp: Response, next: NextFunction) {
  try {
    const authHeader = req.get('Authorization'); // "": 'bearer', token,
    if (!authHeader)
      throw new HTTPError(
        498,
        'Token invalid',
        'Incorrect value in Auth Header'
      );
    if (!authHeader.startsWith('Bearer'))
      throw new HTTPError(498, 'Invalid header', 'Not bearer in auth header');
    const token = authHeader.slice(7);
    const payload = Auth.verifyJWTgettingPayload(token);
    req.info = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}
