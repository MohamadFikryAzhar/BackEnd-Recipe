import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './../config/cloudinaryconfig.js';

const systemStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './tmp');
    },
    filename: function (req, file, callback) {
        return callback(null, file.originalname);
    }
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "RecipeBE",
        allowed_formats: ["png", "jpg", "jpeg","jfif"]
    }
});

export {systemStorage, cloudStorage};