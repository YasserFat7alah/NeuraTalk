/* ======== Packages used ======== */
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { CohereClient } from "cohere-ai";
import { db } from "./config/database.js";
import { chats, users } from "./models/schema.js";
import { eq } from "drizzle-orm";
import { userRouter } from "./router/userRouter.js";

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
/* ========= Register user ========= */
app.use("/", userRouter); // register user router


/* ========= Initialize Stream client ========= */
const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

/* ========= Initialize cohereAI instance ========= */
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

/* ========= Register user ========= */


/* ========= Chat with AI ========= */
app.post("/chat",
 async (req: Request, res: Response): Promise<any> => {
  // Recieve required data from request
  const { message, userId } = req.body || {};

  // Check for missing information
  if (!message || !userId)
    return res
      .status(400)
      .json({ error: "UserId and a message are required!" });

  try {
    // Verify user exists
    const userInStream = (await chatClient.queryUsers({ id: { $eq: userId } })).users.length;
    const userInDB = (await db.select().from(users).where(eq(users.userId,userId))).length;
    if (!userInStream || !userInDB)
      return res
        .status(404)
        .json({ error: "User is not found! please register first" });

    // Create or access channel
    const channel = chatClient.channel("messaging", `chat-${userId}`, {
      name: "AI Chat",
      created_by_id: "ai_bot",
    });
    await channel.create(); //Initialize the channel

    // Send user's message to cohereAI api
    const response = await cohere.chat({
      message: message,
    });

    // catch AI Reply:
    const aiReply: string = response.text ?? "Failed: No Response from AI";

    // Log Messages to chat channel
    await channel.sendMessage({ text: message, user_id: userId }); // log user's message
    await channel.sendMessage({ text: aiReply, user_id: "ai_bot" }); // Log AI Reply to chat channel

    // Save message record in DataBase
    await db.insert(chats).values({userId: userId, message: message, reply:aiReply});

    //server response
    return res.status(200).json({ reply: aiReply });
  } catch (err) {
    console.log("==========================================");
    console.error("Error generating ai response", err);
    console.log("==========================================");

    return res.status(500).json({ error: "Cohere request failed" });
  }
});

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
