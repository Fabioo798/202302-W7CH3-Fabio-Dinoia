import { User } from "./user";

export type Char = {
  id: string;
  name: string;
  category: string;
  owner: User;
};
