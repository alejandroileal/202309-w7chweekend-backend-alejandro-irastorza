import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const usersSchema = new Schema<User>({
  profilePicture: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
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
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  enemies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
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
