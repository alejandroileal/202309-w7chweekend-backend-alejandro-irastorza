import { ImgData } from '../types/img.data';

export type LoginUser = {
  userName: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  kittyName: string;
  ownerName: string;
  age: number;
  profilePicture: ImgData;
  friends: User[];
  enemies: User[];
};
