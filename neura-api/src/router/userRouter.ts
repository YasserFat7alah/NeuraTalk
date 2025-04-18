import express from "express";
import { 
    registerUser 
} from "../controllers/userController.js";


const router = express.Router();

/* --- --- --- INITIALIZE ROUTERS --- --- --- */
    // REGISTER USER ROUTER
    router.post("/register-user", registerUser);

    // 
/* --- --- --- --- ---- ---- --- --- --- --- */


export { router as userRouter };


