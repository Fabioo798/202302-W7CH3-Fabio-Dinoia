import createDebug from 'debug';
import { User } from '../../entities/user.js';
import { HTTPError } from '../../errors/error.js';
import { Repo } from '../repo.interface.js';
import { UserModel } from './user.mongo.model.js';

const debug = createDebug('W7CH3:repo');

export class UserRepo implements Repo<User> {
  async query(): Promise<User[]> {
    debug('query');
    const data = await UserModel.find();
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not Found', 'Id not found');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    if (!data) throw new HTTPError(404, 'Not Found', 'element not found');
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    console.log('create', data);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not Found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not Found',
        'Delete not possible: id not found'
      );
  }
}
