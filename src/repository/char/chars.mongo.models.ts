import { model, Schema, SchemaTypes } from 'mongoose';
import { Char } from '../../entities/char.js';

const charSchema = new Schema<Char>({
  name: {
    type: SchemaTypes.String,
    require: true,
    unique: false,
  },
  category: {
    type: SchemaTypes.String,
    require: true,
    unique: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'User', // Same as the model below
  },
});

charSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject._password;
  },
});

export const CharModel = model('Char', charSchema, 'chars');
