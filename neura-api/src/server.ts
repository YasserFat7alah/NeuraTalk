import express, {Request, response, Response} from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { CohereClient } from "cohere-ai";
/* import OpenAI from "openai"; */


dotenv.config();               //lets server compile .env to get the variables inside
const app = express();         //initialize the server app

app.use(cors());               // cors middleware to access resources from different origins
app.use(express.json());       // json middleware to allow getting json in requests
app.use(express.urlencoded({ extended: false })); // url middleware to allow getting forms

// Initialize Stream client
const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
)

//Initialize cohereAI instance
const cohere = new CohereClient({token: process.env.COHERE_API_KEY});

//Initialize openAI instance
/* const openAI =new OpenAI({apiKey: process.env.OPENAI_API_KEY}); */

//Register user with stream-chat
app.post('/register-user', async (req: Request, res: Response): Promise<any> => 
    {
    const {name, email} = req.body || {};

    //check if any information is missing
    if(!name || !email)
         return res.status(400).json({error: "Name and Email are required!"}); 
    

    
    try {
        const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_"); // Initialize userId

        const userResponse = await chatClient.queryUsers({id : { $eq : userId }}); // Search for user with the same id
        // if id doesnt match a user
        if(!userResponse.users.length){
            // add new user to the stream
            await chatClient.upsertUser({
                id: userId,
                name: name,
                email: email,
                role: "user"});
            return res.status(200).json({userId, name, email});
        }
        // if id matches a user
        return res.status(500).json("User exists");
    }
    //error handler
    catch (error) {  
        return res.status(500).json({error: "Internal server error!"})
    }
    
})

// Send Message to AI 
app.post('/chat', async (req: Request, res: Response): Promise<any> =>{

    const {message, userId} = req.body || {};

    // Check for missing information
    if(!message || !userId) 
        return res.status(400).json({error: "UserId and a message are required!"});

    try {
        // Verify user exists 
        const userResponse = await chatClient.queryUsers({id: {$eq: userId }});
        if(!userResponse.users.length)
            return res.status(404).json({error: "User is not found! please register first"});
        
        // Send message to cohereAI api
        const response = await cohere.chat({
            message: message
        });

        // AI Reply: 
        const reply :string = response.text

        return res.status(200).json({ reply: reply });
    }
    catch (err) {
        console.error(err);
        
       return res.status(500).json({ error: "Cohere request failed" }); 
    }



});

const PORT = process.env.PORT || 5000; // takes port value from .env file (fallback value : 5000)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));