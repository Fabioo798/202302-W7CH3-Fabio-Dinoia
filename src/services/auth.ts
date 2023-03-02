import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';

export type PayLoadToken = {
  email: string;
  role: string;
};

const salt = 10;

export class Auth {
  static createJWT(payload: PayLoadToken) {
    if (!config.jwtsecret) return;

    return jwt.sign(payload, config.jwtsecret);
  }

  static verifyJWT(token: string) {
    const result = jwt.verify(token, config.jwtsecret as string);
    if (typeof result === 'string') throw new Error('Invalid payload');
    return result;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
