# NeuraTalk API

This is the backend for NeuraTalk application. It is a Node/Express/TypeScript API that uses [Stream](https://www.getStream.io) for chat, chat history, and user management. It also uses a PostgreSQL database from [Neon](https://www.neon.tech) to store user information and chat history. We use the Drizzle ORM to interact with the database. [Cohere AI](https://cohere.com/) is used for the AI chatbot.

The Vue.js frontend for this application can be found [here](https://github.com/YasserFat7alah/NeuraTalk/tree/main/neura-ui).

<br/><br/>

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:

```
PORT=8000
STREAM_API_KEY=""
STREAM_API_SECRET=""
COHERE_API_KEY=""
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
```

You can get these keys by signing up for Stream, cohereAI, and Neon.

4. Run database migrations with Drizzle Kit:

```
npx drizzle-kit generate
npx drizzle-kit migrate
```

This will create the necessary tables in your database.

5. Run the server with `npm run dev` and open it on `http://localhost:5174`

<br/><br/>
 

## Endpoints

- POST `/register-user` - Create a user in Stream chat and in our own database.
- POST `/chat` - Creates a new Stream chat channel, sends a request to Open AI to generate a response, and saves the chat history in our database.
- POST `/chat/:userId` - Gets the chat history for a specific user.
  
<br/><br/>

  ##
> `userId` is `email` replacing `@` - `.` by `_` => `example@gmail.com` : `example_gmail_com`
>
>  💡 You can reach me at [YasserFat7alah@gmail.com](mailto:yasserfat7alah@gmail.com) for more help.
