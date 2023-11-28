// Lo que buscamos es crear un fichero que gestione todo lo que queremos que haga multer

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export class FileInterceptor {
  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const options: multer.Options = {
      storage: multer.diskStorage({
        destination: './public/uploads',
        filename(_req, file, callback) {
          const prefix = crypto.randomUUID();
          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize },
    };

    const middleware = multer(options).single(fileName);

    // Retornamos lo que ya había en el body + el middleware (este paso se hace porque este middleware borra el body por default)

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, next);
      req.body = { ...previousBody, ...req.body };
    };
  }
}
