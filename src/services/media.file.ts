/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import { ImgData } from '../types/img.data.js';
import { HttpError } from '../types/http.error.js';

export class MediaFiles {
  constructor() {
    cloudinary.config({
      secure: true,
    });
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = (err as { error: Error }).error as Error;
      throw new HttpError(406, 'Not Acceptable', error.message);
    }
  }
}
