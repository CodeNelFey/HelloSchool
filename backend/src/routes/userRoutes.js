import express from 'express';
import { getUserByIdController, getUserImage } from '../controllers/userController.js';

const router = express.Router();

router.get('/getImage', getUserImage);
router.get('/:id', getUserByIdController);

export default router;
