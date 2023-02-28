import { model, Schema, SchemaTypes } from "mongoose";
import { Char } from "../entities/Char";

const charSchema = new Schema<Char>({
  id: {
    type: SchemaTypes.String,
    require: true,
    unique: true,
  },
  name: {
    type: SchemaTypes.String,
    require: true,
    unique: true,
  },
  category: {
    type: SchemaTypes.String,
    require: true,
    unique: true,
  }
});

export const CharModel = model('Char', charSchema, 'chars');
