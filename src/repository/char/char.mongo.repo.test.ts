import { Char } from '../../entities/char';
import { CharRepo } from './char.mongo.repo';
import { CharModel } from './chars.mongo.models';

jest.mock('./chars.mongo.models');

describe('Given', () => {
  const repo = new CharRepo();
  describe('When is called', () => {
    test('Then should be instantiated', () => {
      expect(repo).toBeInstanceOf(CharRepo);
    });
  });

  describe('When i use query', () => {
    test('Then should return the data', async () => {
      const mockData = [{ chars: 'test' }];
      (CharModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockData),
      }));

      const result = await repo.query();

      expect(CharModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('When i use queryId', () => {
    beforeEach(async () => {
      (CharModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
    });
    test('Then should return the selected data', async () => {
      const result = await repo.queryId('1');
      expect(CharModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then if the findById method resolve value to undefined, it should throw an Error', async () => {
      (CharModel.findById as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When i use search', () => {
    beforeEach(async () => {
      (CharModel.find as jest.Mock).mockResolvedValue([]);
    });
    test('Then should return the created data', async () => {
      const result = await repo.search({ key: 'test', value: 'true' });

      expect(result).toEqual([]);
    });
  });

  describe('When i use create', () => {
    test('Then it should create a new Char', async () => {
      (CharModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ name: 'test' });
      expect(CharModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method is used', () => {
    beforeEach(async () => {
      (CharModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '2' });
    });

    test('Then if it has an object to update, it should return the updated object', async () => {
      const mockChar = {
        id: '2',
        name: 'test',
      } as Partial<Char>;

      const result = await repo.update(mockChar);
      expect(CharModel.find).toHaveBeenCalled();
      expect(result).toEqual({ id: '2' });
    });
    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      const mockChar = {
        id: '2',
        name: 'test',
      } as Partial<Char>;
      (CharModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockChar)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (CharModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(CharModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (CharModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
