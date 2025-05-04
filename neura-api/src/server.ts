/* ======== Packages used ======== */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routers
import { userRouter } from "./router/userRouter.js"; // user router
import { chatRouter } from "./router/chatRouter.js"


dotenv.config(); //lets server compile .env to get the variables inside

const app = express(); //initialize the server app

/*============= Middlewares used ============= */
app.use(cors()); // cors middleware to access resources from different origins
app.use(express.json()); // json middleware to allow getting json in requests
app.use(express.urlencoded({ extended: false })); // url middleware to allow getting forms

/* ========= Defined Middlewares ========= */
  app.use(
    "/",
     userRouter,
     chatRouter
  ); 

/* ========= App listener & port config ========= */
const PORT = process.env.PORT || 5000; // takes port value from .env file (fallback value : 5000)
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log("==========================================");
});
