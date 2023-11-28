import createDebug from 'debug';
import { Repository } from './repo.js';
import { LoginUser, User } from '../entities/user.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('KB:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({
      userName: loginUser.userName,
    }).exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  search({ key, value }: { key: string; value: unknown }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async addFriend(
    friendId: User['id'],
    currentUserId: User['id']
  ): Promise<User> {
    // TEMPORAL
    debug('CurrentUserId:', currentUserId);
    debug('friendId:', friendId);

    //

    // Buscando el usuario logeado
    const currentUser = await UserModel.findById(currentUserId).exec();

    // Casos de error:
    if (friendId === currentUserId) {
      throw new HttpError(
        406,
        'Not Acceptable',
        'Is not possible to add yourself'
      );
    }

    if (!currentUser) {
      throw new HttpError(404, 'Not Found', 'There is no user logged');
    }

    // Casos posibles de Array:
    if (currentUser.friends.includes(friendId as unknown as User)) {
      return currentUser;
    }

    // Comprobar si está en enemigos, de ser así, borrarlo:
    if (currentUser.enemies.includes(friendId as unknown as User)) {
      const updatedCurrentUser = await UserModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { enemies: friendId } },
        { new: true }
      ).exec();

      // Comprobación de actualización
      if (!updatedCurrentUser) {
        throw new HttpError(404, 'Not Found', 'The update was not possible');
      }
    }

    // Sumar a la lista de amigos
    const result = await UserModel.findByIdAndUpdate(
      currentUserId,
      { $push: { friends: friendId } },
      { new: true }
    ).exec();

    // Error al sumar a la lista de amigos:
    if (!result) {
      throw new HttpError(404, 'Not Found', 'The update was not possible');
    }

    return result;
  }

  async addEnemy(
    enemyId: User['id'],
    currentUserId: User['id']
  ): Promise<User> {
    // Buscando el usuario logeado
    const currentUser = await UserModel.findById(currentUserId).exec();

    // Casos de error:
    if (enemyId === currentUserId) {
      throw new HttpError(
        406,
        'Not Acceptable',
        'Is not possible to add yourself'
      );
    }

    if (!currentUser) {
      throw new HttpError(404, 'Not Found', 'There is no user logged');
    }

    // Casos posibles de Array:
    if (currentUser.enemies.includes(enemyId as unknown as User)) {
      return currentUser;
    }

    // Comprobar si está en amigos, de ser así, borrarlo:
    if (currentUser.friends.includes(enemyId as unknown as User)) {
      const updatedCurrentUser = await UserModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { friends: enemyId } },
        { new: true }
      ).exec();

      // Comprobación de actualización
      if (!updatedCurrentUser) {
        throw new HttpError(404, 'Not Found', 'The update was not possible');
      }
    }

    // Sumar a la lista de enemigos
    const result = await UserModel.findByIdAndUpdate(
      currentUserId,
      { $push: { enemies: enemyId } },
      { new: true }
    ).exec();

    // Error al sumar a la lista de amigos:
    if (!result) {
      throw new HttpError(404, 'Not Found', 'The update was not possible');
    }

    return result;
  }

  async removeFriend(
    friendIdToRemove: User['id'],
    currentUserId: User['id']
  ): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      // 1. Verificamos que el usuario actual existe en la base de datos:
      const currentUser = await UserModel.findById(currentUserId).exec();

      if (!currentUser) {
        throw new HttpError(404, 'Not Found', 'There is no user logged');
      }

      // 2. Verificamos que el amigo no esté en el array
      if (!currentUser.friends.includes(friendIdToRemove as unknown as User)) {
        return currentUser;
      }

      // 3. Eliminación del array de amigos:
      const updatedCurrentUser = await UserModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { friends: friendIdToRemove } },
        { new: true }
      );

      // 4. Caso de error (si no se logra actualizar el array)

      if (!updatedCurrentUser) {
        throw new HttpError(
          404,
          'Not Found',
          'The friend removal was not possible'
        );
      }

      return updatedCurrentUser;
    } catch (error) {
      throw error;
    }
  }

  async removeEnemy(
    enemyIdToRemove: User['id'],
    currentUserId: User['id']
  ): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      // 1. Verificamos que el usuario actual existe en la base de datos:
      const currentUser = await UserModel.findById(currentUserId).exec();

      if (!currentUser) {
        throw new HttpError(404, 'Not Found', 'There is no user logged');
      }

      // 2. Verificamos que el enemigo no esté en el array
      if (!currentUser.enemies.includes(enemyIdToRemove as unknown as User)) {
        return currentUser;
      }

      // 3. Eliminación del array de enemigos:
      const updatedCurrentUser = await UserModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { enemies: enemyIdToRemove } },
        { new: true }
      );

      // 4. Caso de error (si no se logra actualizar el array)

      if (!updatedCurrentUser) {
        throw new HttpError(
          404,
          'Not Found',
          'The enemy removal was not possible'
        );
      }

      return updatedCurrentUser;
    } catch (error) {
      throw error;
    }
  }
}
