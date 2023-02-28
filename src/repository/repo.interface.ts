export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(id: string): Promise<T>;
  create(info: Partial<T>): Promise<T>;
  update(info: Partial<T>): Promise<T>;
  destroy(id: string): Promise<void>;
}
