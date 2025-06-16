import express from 'express';
import {
    getUserByIdController,
    getUserImage,
    upload,
    uploadProfilePicture,
    searchUsers
} from '../controllers/userController.js';
const router = express.Router();

router.get('/getImage', getUserImage);
router.get('/getUserByID/:id', getUserByIdController);
router.post('/getUserByID/:id/upload-profile', upload.single('profile'), uploadProfilePicture);
router.get('/search', searchUsers);

export default router;
