import express from 'express';
import { 
    chatWithAI 
} from '../controllers/chatController.js';


const router = express.Router();


/* --- --- --- INITIALIZE ROUTERS --- --- --- */
    // CHAT WITH AI ROUTER
    router.post('/chat', chatWithAI);
/* --- --- --- --- ---- ---- --- --- --- --- */

export {router as chatRouter};