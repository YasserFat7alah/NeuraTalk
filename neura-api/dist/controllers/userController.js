import { chatClient } from "../utility/chatClient.js"; // import stream chat client
import { db } from "../config/database.js"; // import database connection
import { users } from "../models/schema.js"; // import user schema
import { eq } from "drizzle-orm"; // import drizzle orm query builder
// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/* ========= Register user ========= */
export const registerUser = async (req, res) => {
    // Recieve name and email from request
    const { name, email } = req.body || {};
    //check if any information is missing
    if (!name || !email) {
        res.status(400).json({ error: "Name and Email are required!" });
        return;
    }
    // Validate email format
    if (typeof email !== 'string' || !isValidEmail(email)) {
        res.status(400).json({ error: "Please provide a valid email address!" });
        return;
    }
    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: "Name must be a non-empty string!" });
        return;
    }
    if (name.length > 100) {
        res.status(400).json({ error: "Name is too long! Maximum length is 100 characters." });
        return;
    }
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
            console.log(`user: "${userId}" doesn't exist in the stream chat, adding him...`);
            await chatClient.upsertUser({ id: userId, name: name, email: email, role: "user", });
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
        res.status(200).json({ userId, name: name.trim(), email: email.trim().toLowerCase() });
    }
    catch (err) {
        //error handler
        console.log("==========================================");
        console.error("Error registering user", err);
        console.log("==========================================");
        res.status(500).json({ error: "Failed to register user. Please try again later." });
    }
};
