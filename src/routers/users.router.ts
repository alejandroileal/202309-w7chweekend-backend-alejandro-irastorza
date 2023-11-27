import { Router as createRouter } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
// Import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('KB:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

usersRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);

usersRouter.post(
  '/register',
  fileInterceptor.singleFileStore('profile-picture').bind(fileInterceptor),
  controller.create.bind(controller)
); // Se mantiene con libre acceso

usersRouter.post('/login', controller.login.bind(controller)); // Se mantiene con libre acceso

usersRouter.patch(
  './add-friend/:id',
  interceptor.authorization.bind(interceptor),
  controller.addFriend.bind(controller)
);

usersRouter.patch(
  './add-enemy/:id',
  interceptor.authorization.bind(interceptor),
  controller.addEnemy.bind(controller)
);

// Se necesita autenticar para asegurarnos que el usuario puede modificarse a sí mismo.
usersRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.update.bind(controller)
);

usersRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.delete.bind(controller)
);

usersRouter.patch(
  '/remove-friend/:id',
  interceptor.authorization.bind(interceptor),
  controller.removeFriend.bind(controller)
);

usersRouter.patch(
  '/remove-enemy/:id',
  interceptor.authorization.bind(interceptor),
  controller.removeFriend.bind(controller)
);

usersRouter.get('/:id', controller.getById.bind(controller));
