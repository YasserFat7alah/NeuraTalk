import express from 'express';
import { 
    chatWithAI ,
    getChatHistory
} from '../controllers/chatController.js';


const router = express.Router();


/* --- --- --- INITIALIZE ROUTERS --- --- --- */
    // CHAT WITH AI ROUTER
    router.post('/chat', chatWithAI);

    // GET CHAT HISTORT ROUTER
    router.post('/chat/:userId', getChatHistory);
/* --- --- --- --- ---- ---- --- --- --- --- */

export {router as chatRouter};