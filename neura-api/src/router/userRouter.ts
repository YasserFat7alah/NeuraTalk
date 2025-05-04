import express from "express";
import { 
    registerUser,
    checkUser,
} from "../controllers/userController.js";


const router = express.Router();

/* --- --- --- INITIALIZE ROUTERS --- --- --- */
    // CHECK USER IN SYSTEM ROUTER
    router.post("/user/check", checkUser)

    // REGISTER USER ROUTER
    router.post("/user/register", registerUser);

    // LOGIN USER ROUTER
    router.post("/user/login",);

    // UPDATE USER ROUTER
    router.post("/user/update",);
/* --- --- --- --- ---- ---- --- --- --- --- */


export { router as userRouter };


