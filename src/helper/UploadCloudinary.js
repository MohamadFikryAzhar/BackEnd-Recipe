import multer from 'multer';
import { cloudStorage } from '../config/diskstorage.js';

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jfif') {
        callback(null, true);
        req.fileValid = true;
    } else {
        req.fileValid = false;
        const error = new Error("Unsupported filetype");
        error.status = 400
        callback(error, false);
    }
}

const maxSize = 3.0 * 1024 * 1024;
const upload = multer({storage: cloudStorage, fileFilter: fileFilter, limits: {
    fileSize: maxSize
}});

export default upload;