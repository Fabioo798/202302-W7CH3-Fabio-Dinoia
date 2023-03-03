import createDebug from 'debug';
import { Char } from '../../entities/char.js';
import { HTTPError } from '../../errors/error.js';
import { CharModel } from './chars.mongo.models.js';
import { Repo } from './../repo.interface.js';

const debug = createDebug('W7CH3:repo');

export class CharRepo implements Repo<Char> {
  async query(): Promise<Char[]> {
    debug('query');
    const data = await CharModel.find().populate('owner', { chars: 0 });

    return data;
  }

  async queryId(id: string): Promise<Char> {
    debug('queryId');
    const data = await CharModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not Found', 'Id not found');
    return data;
  }

  async search(_query: { key: string; value: unknown }): Promise<Char[]> {
    debug('search');
    return [];
  }

  async create(info: Partial<Char>): Promise<Char> {
    debug('create');
    const data = await CharModel.create(info);

    return data;
  }

  async update(info: Partial<Char>): Promise<Char> {
    debug('update');
    const data = await CharModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not Found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy method');

    const data = await CharModel.findByIdAndDelete(id);

    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found '
      );
  }
}
