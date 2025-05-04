import { Request, Response } from "express";
import { chatClient } from "../utility/chatClient.js"; // import stream chat client
import { db } from "../config/database.js"; // import database connection
import { users } from "../models/schema.js"; // import user schema
import { eq } from "drizzle-orm"; // import drizzle orm query builder
import { validateEmail } from '../utility/emailUtil.js';
import { validatePW, encryptPW, comparePW } from '../utility/pwUtil.js';

/* ========= CHECK FOR USER ========= */
export const checkUser = async (req: Request, res: Response): Promise<any> => {
  const { email } =req.body || {};
  if(!email) { 
    console.error("ERROR : Email is required!");
    return res.status(400).json({ error: " Email is required!" }); 
  }

  try {
    // search for user in database
    const userInDB = await db.select().from(users).where(eq(users.email, email)); 
    
    if(!userInDB.length) {
      const status = 0;
      console.log ("user is not defined register");
      return res.status(200).json({status});
    }

    if(!userInDB[0].password) {
      const status = 1;
      console.log ("user needs to update password");
      return res.status(200).json({status});;
    } else {
      const status = 2;
      console.log ("enter password to login ...");
      return res.status(200).json({status});;
    }
    
} catch (err) {
    console.log("==========================================");
    console.error("Error finding user", err);
    console.log("==========================================");
    return res.status(500).json({ error: "finding user request failed" })
  }
}

/* ========= REGISTER USER ========= */
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    // Recieve name and email from request
    const { name, // REQUIRED
            email, // REQUIRED
            password // REQUIRED
    } = req.body || {};

    // CHECK FOR ANYMISSING DATA
    if (!name || !email || !password){
      console.log(`data missing? : 
        name: ${!name},
        email: ${!email},
        password: ${!password}`);
          return res.status(400).json({ error: "Missing data!" });
    };
    
    // VALIDATE EMAIL
    if(!validateEmail(email)){
      console.log(`Invalid E-mail: ${email}`);
      return res.status(400).send({error: "Invalid E-mail"});
    };
    
    // CHECK FOR USER MATCHES
    const userExists = (await db.select().from(users).where(eq(users.email, email))).length;
    if(userExists){ 
      console.log(`USER EXISTS! ${email}`);
      return res.status(400).send({error: "user already registered, login?"});
    }

    // VALIDATE PASSWORD
    if(!validatePW(password)){
      console.log(`password must have:
          - atleast 8 characters
          - atleast one special character  @ $ ! % * ? & 
          - atleast one lower-case letter
          - atleast one upper-case letter`);
          
      return res.status(400).send({error: "Invalid password -follow password instructions"});
    }

    // GENERATE USER_ID 
    const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_"); // Initialize userId

    // SEARCH FOR USER IN STREAM CHAT
    const userInStream = (await chatClient.queryUsers({ id: { $eq: userId } })).users.length; 
    // check if user is not recorded in stream chat
    if (!userInStream) {
      // add new user to the stream
      console.log(`user: "${userId}" doesn't exist in the stream chat, adding him...`)
      await chatClient.upsertUser({id: userId, name: name, email: email, role: "user",});
      console.log("user added to stream chat successfully!");
      console.log("==========================================");
    }


    // SEND USER TO DATABASE
    await db.insert(users).values({userId, name, email, password: await encryptPW(password) });
    // SERVER RESPONSE
    console.log(`
                email: ${email}
                password: ${password}
                name: ${name}`);
    return res.status(200).json({user: { name , email, password}});

  } catch (err) {
    //error handler
    console.log("==========================================");
    console.error("Error regestring user", err);
    console.log("==========================================");
    return res.status(500).json({ error: "adding user request failed" });
  }
};

/* ========= LOGIN USER ========= */
