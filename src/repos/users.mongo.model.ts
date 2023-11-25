import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const usersSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  kittyName: String,
  ownerName: String,
  friends: Array,
  enemies: Array,
});

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
