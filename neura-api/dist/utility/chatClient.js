import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config(); //lets server compile .env to get the variables inside
// Validate required environment variables
if (!process.env.STREAM_API_KEY) {
    throw new Error('STREAM_API_KEY is not defined in environment variables');
}
if (!process.env.STREAM_API_SECRET) {
    throw new Error('STREAM_API_SECRET is not defined in environment variables');
}
/* ========= Initialize Stream client ========= */
export const chatClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
