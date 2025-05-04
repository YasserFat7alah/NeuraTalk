import { Request, Response } from "express";
import { chatClient } from "../utility/chatClient.js"; // import stream chat client
import { db } from "../config/database.js"; // import database connection
import { users } from "../models/schema.js"; // import user schema
import { eq } from "drizzle-orm"; // import drizzle orm query builder


/* ========= Register user ========= */
export const registerUser = async (req: Request, res: Response): Promise<any> => {
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
  };
