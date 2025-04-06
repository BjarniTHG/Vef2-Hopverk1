import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

<<<<<<< HEAD
  export const uploadToCloudinary = (fileBuffer: Buffer): Promise<unknown> => {
=======

  export const uploadToCloudinary = (fileBuffer: Buffer): Promise<unknown> => {

>>>>>>> 3b6de3ba7d0415bd4521dc2c219396615070d45d
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profile_pics" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
  };

  export default cloudinary;