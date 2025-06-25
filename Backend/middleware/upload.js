import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Events',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
        transformation: [{ width: 600, height: 600, crop: 'limit' }],
        resource_type: 'auto' // Automatically determine the resource type,
    }
});
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop()); 
    
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
};

const upload =multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});
export default upload;