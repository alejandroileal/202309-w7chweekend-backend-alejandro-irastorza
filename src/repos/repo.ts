export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  search({ key, value }: { key: keyof X; value: unknown }): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(_id: X['id']): Promise<void>;
  addFriend(_friendId: X['id'], _currentUserId: X['id']): Promise<X>;
  addEnemy(_enemyId: X['id'], _currentUserId: X['id']): Promise<X>;
  removeFriend(_friendId: X['id'], _currentUserId: X['id']): Promise<X>;
  removeEnemy(_enemyId: X['id'], _currentUserId: X['id']): Promise<X>;
}
