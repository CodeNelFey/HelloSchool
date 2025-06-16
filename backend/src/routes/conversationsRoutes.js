import express from 'express';
import {createConversation, getUserConversations, leaveConversation} from '../controllers/conversationController.js';

const router = express.Router();

router.post('/create', createConversation);
router.get('/user/:userId', getUserConversations);
router.post('/leaveConv', leaveConversation);

export default router;
