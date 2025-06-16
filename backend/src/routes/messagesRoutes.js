import express from 'express';
import { sendMessage, getMessagesByConversation } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:conversationId', getMessagesByConversation);

export default router;
