import express from 'express';
import { chatWithAI, getChatHistory } from '../controllers/chatController.js';
const router = express.Router();
/* --- --- --- INITIALIZE ROUTERS --- --- --- */
// CHAT WITH AI ROUTER
router.post('/chat', chatWithAI);
// GET CHAT HISTORY ROUTER (should be GET, not POST)
router.get('/chat/:userId', getChatHistory);
/* --- --- --- --- ---- ---- --- --- --- --- */
export { router as chatRouter };
