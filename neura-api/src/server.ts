/* ======== Packages used ======== */
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { CohereClient } from "cohere-ai";
import { db } from "./config/database.js";
import { chats, users } from "./models/schema.js";
import { eq } from "drizzle-orm";

//Routers
import { userRouter } from "./router/userRouter.js"; // user router
import { chatRouter } from "./router/chatRouter.js"


dotenv.config(); //lets server compile .env to get the variables inside

const app = express(); //initialize the server app

/*============= Middlewares used ============= */
app.use(cors()); // cors middleware to access resources from different origins
app.use(express.json()); // json middleware to allow getting json in requests
app.use(express.urlencoded({ extended: false })); // url middleware to allow getting forms

app.get('/', (req, res) => {
  try {
    res.send('Server Started!');
  } catch (err) { 
    console.error("Error in server: ", err);
    res.status(500).send('Server Error!');}
});

/* ========= User APIs ========= */
  // Register new user
  app.use("/", userRouter); // register user router


/* ========= Chat APIs ========= */
  // Chat with AI
  app.use("/", chatRouter);



/* ========= Initialize Stream client ========= */
const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);






/* ========= Get chat history ========= */
app.post("/chat/:userId",
    async (req: Request, res: Response): Promise<any> =>{
        
        // get user id from request
        const userId = req.params.userId;

        //check if id is missing 
        if(!userId) {
            console.error("user id is missing!");
            console.log("========================");
            return res.status(400).json({error: "user id is missing!"});
        }

        try {
            const chatHistory = await db.select().from(chats).where(eq(chats.userId, userId));

            console.log("messages: ", chatHistory);
            console.log("==========================================");
            return res.status(200).json({messages: chatHistory});
            
        } catch (err) {
            console.log("==========================================");
            console.error("Error fetching chat history", err);
            console.log("==========================================");

    return res.status(500).json({ error: "failed to fetch chat history" });
        }
});


/* ========= App listener & port config ========= */
const PORT = process.env.PORT || 5000; // takes port value from .env file (fallback value : 5000)
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log("==========================================");
});
