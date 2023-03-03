import { Char } from "./char";

export type User = {
  id: string,
  email: string;
  password: string;
  chars: Char[];
}
