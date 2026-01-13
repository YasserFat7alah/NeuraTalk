import { Request, Response } from "express";
import { chatClient } from "../utility/chatClient.js";
import { db } from "../config/database.js";
import { chats, users } from "../models/schema.js";
import { eq } from "drizzle-orm";
import { CohereClient } from "cohere-ai";

// Validate COHERE_API_KEY
if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not defined in environment variables');
}

/* ========= Initialize cohereAI instance ========= */
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

/* ========= Chat with AI ========= */
export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
     // Recieve required data from request
     const { message, userId } = req.body || {};
   
     // Check for missing information
     if (!message || !userId) {
       res.status(400).json({ error: "UserId and a message are required!" });
       return;
     }

     // Validate message length
     if (typeof message !== 'string' || message.trim().length === 0) {
       res.status(400).json({ error: "Message must be a non-empty string!" });
       return;
     }

     if (message.length > 5000) {
       res.status(400).json({ error: "Message is too long! Maximum length is 5000 characters." });
       return;
     }

     // Validate userId format
     if (typeof userId !== 'string' || userId.trim().length === 0) {
       res.status(400).json({ error: "UserId must be a valid string!" });
       return;
     }
   
     try {
       // Verify user exists
       const userInStream = (await chatClient.queryUsers({ id: { $eq: userId } })).users.length;
       const userInDB = (await db.select().from(users).where(eq(users.userId,userId))).length;
       if (!userInStream || !userInDB) {
         res.status(404).json({ error: "User is not found! please register first" });
         return;
       }
   
       // Create or access channel
       const channel = chatClient.channel("messaging", `chat-${userId}`, {
         name: "AI Chat",
         created_by_id: "ai_bot",
       });
       
       // Create or watch channel (watch will create if it doesn't exist)
       try {
         await channel.watch();
       } catch (channelError: any) {
         // If watch fails, try to create it
         try {
           await channel.create();
         } catch (createError: any) {
           // Channel might already exist or there's another issue
           // Log the error but continue if it's a channel existence issue
           const errorMessage = createError?.message?.toLowerCase() || '';
           if (!errorMessage.includes('already exists') && !errorMessage.includes('duplicate')) {
             throw createError;
           }
         }
       }
   
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
       await db.insert(chats).values({userId: userId, message: message.trim(), reply: aiReply});
   
       //server response
       res.status(200).json({ reply: aiReply });
     } catch (err) {
       console.log("==========================================");
       console.error("Error generating ai response", err);
       console.log("==========================================");
   
       res.status(500).json({ error: "Failed to generate AI response. Please try again later." });
     }
   };

/* ========= Get chat history ========= */
export const getChatHistory = async (req: Request, res: Response): Promise<void> =>{
        
    // get user id from request
    const userId = req.params.userId;

    //check if id is missing 
    if(!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        console.error("user id is missing or invalid!");
        console.log("========================");
        res.status(400).json({error: "user id is required and must be a valid string!"});
        return;
    }

    try {
        const chatHistory = await db.select().from(chats).where(eq(chats.userId, userId.trim()));

        console.log(`Retrieved ${chatHistory.length} messages for user: ${userId}`);
        console.log("==========================================");
        res.status(200).json({messages: chatHistory});
        
    } catch (err) {
        console.log("==========================================");
        console.error("Error fetching chat history", err);
        console.log("==========================================");

        res.status(500).json({ error: "Failed to fetch chat history. Please try again later." });
    }
};