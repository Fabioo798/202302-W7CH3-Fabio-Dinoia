import { User } from './../../entities/user.js';
import { UserRepo } from './user.file.repo.js';
import { UserModel } from './user.mongo.model.js';

jest.mock('./user.mongo.model.js');

describe('Given', () => {
  const repo = new UserRepo();
  describe('When is called', () => {
    test('Then should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserRepo);
    });
  });

  describe('When i use query', () => {
    test('Then should return the data', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When i use queryId', () => {
    beforeEach(async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
    });
    test('Then should return the selected data', async () => {
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then if the findById method resolve value to undefined, it should throw an Error', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When i use search', () => {
    beforeEach(async () => {
      (UserModel.find as jest.Mock).mockResolvedValue({
        key: 'test',
        value: 'test',
      });
    });
    test('Then should return the created data', async () => {
      const result = await repo.search({
        key: 'test',
        value: 'test',
      });

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual({ key: 'test', value: 'test' });
    });

    test('if the data is not found should throw error', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(null);
      expect(async () =>
        repo.search({ key: 'test', value: 'test' })
      ).rejects.toThrow();
    });
  });

  describe('When i use create', () => {
    test('Then it should create a new User', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ email: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '2' });
    });

    test('Then if it has an object to update, it should return the updated object', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;

      const result = await repo.update(mockUser);
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual({ id: '2' });
    });
    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
