import express from 'express';
import {
    getUserByIdController,
    getUserImage,
    upload,
    uploadProfilePicture
} from '../controllers/userController.js';
const router = express.Router();

router.get('/getImage', getUserImage);
router.get('/:id', getUserByIdController);
router.post('/:id/upload-profile', upload.single('profile'), uploadProfilePicture); // ← ici

export default router;
