import express from "express";
import { 
    registerUser 
} from "../controllers/userController.js";


const router = express.Router();

/* --- --- --- Initialize Routes --- --- --- */
router.post("/register-user", registerUser);
/* --- --- --- --- ---- ---- --- --- --- --- */


export { router as userRouter };


