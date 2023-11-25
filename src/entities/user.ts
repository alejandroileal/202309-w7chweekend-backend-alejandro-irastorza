export type LoginUser = {
  userName: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  kittyName: string;
  ownerName: string;
  age: number;
  friends: User[];
  enemies: User[];
};
