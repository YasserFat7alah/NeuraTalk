/* ======== Packages used ======== */
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { CohereClient } from "cohere-ai";
import { db } from "./config/database.js";
import { chats, users } from "./db/schema.js";
import { eq } from "drizzle-orm";

dotenv.config(); //lets server compile .env to get the variables inside

const app = express(); //initialize the server app

/*============= Middlewares used ============= */
app.use(cors()); // cors middleware to access resources from different origins
app.use(express.json()); // json middleware to allow getting json in requests
app.use(express.urlencoded({ extended: false })); // url middleware to allow getting forms

/* ========= Initialize Stream client ========= */
const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

/* ========= Initialize cohereAI instance ========= */
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

/* ========= Register user ========= */
app.post( "/register-user",
  async (req: Request, res: Response): Promise<any> => {
    // Recieve name and email from request
    const { name, email } = req.body || {};

    //check if any information is missing
    if (!name || !email)
      return res.status(400).json({ error: "Name and Email are required!" });

    try {
      const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_"); // Initialize userId

      const userInDB = (await db.select().from(users).where(eq(users.userId, userId))).length; // search for user in database
      const userInStream = (await chatClient.queryUsers({ id: { $eq: userId } })).users.length; // Search for user in stream chat

      //Check if user exits in both steam and database
      /* if (userInDB && userInStream)
                 return res.status(500).json({ message: "user already exists in both stream and database" });
 */
      // check if user is not recorded in stream chat
      if (!userInStream) {
          // add new user to the stream
          console.log(`user: "${userId}" doesn't exist in the stream chat, adding him...`)
          await chatClient.upsertUser({id: userId, name: name, email: email, role: "user",});
          console.log("user added to stream chat successfully!");
          console.log("==========================================");
        }

      //check if user is not recorded in database
      if (!userInDB) {
            //add new user record to database
            console.log(`user: "${userId}" doesn't exist in the database, adding him...`);
            await db.insert(users).values({ userId, name, email });
            console.log("user added to database successfully!");
            console.log("==========================================");
        }

        return res.status(200).json({ userId, name, email });
    } catch (err) {
      //error handler
      console.log("==========================================");
      console.error("Error regestring user", err);
      console.log("==========================================");
      return res.status(500).json({ error: "adding user request failed" });
    }
  }
);

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
