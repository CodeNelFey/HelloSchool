import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
    addFlashcardsToGroup,
    createGroup,
    deleteFlashcard, getFlashcardGroupById, getPublicFlashcardGroups, getUserFlashcardGroups,
    updateFlashcard, updateFlashcardName, updateFlashcardVisibility
} from "../controllers/flashcardController.js";
const router = express.Router();

router.post('/group', authenticateToken, createGroup);
router.put('/edit/:id', authenticateToken, updateFlashcard);
router.put('/rename/:id', authenticateToken, updateFlashcardName);
router.delete('/delete/:id', authenticateToken, deleteFlashcard);
router.post('/group/:id/add', authenticateToken, addFlashcardsToGroup);
router.get('/groups', authenticateToken, getUserFlashcardGroups);
router.get('/group/:id', authenticateToken, getFlashcardGroupById);
router.get('/public-groups', getPublicFlashcardGroups);
router.put('/changeVisibility/:id', authenticateToken, updateFlashcardVisibility)

export default router;
