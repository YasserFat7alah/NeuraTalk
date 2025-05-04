import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';


dotenv.config(); //lets server compile .env to get the variables inside

/* ========= Initialize Stream client ========= */
export const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
  );