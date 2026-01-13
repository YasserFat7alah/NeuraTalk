/* ======== Packages used ======== */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routers
import { userRouter } from "./router/userRouter.js"; // user router
import { chatRouter } from "./router/chatRouter.js"


dotenv.config(); //lets server compile .env to get the variables inside

const app = express(); //initialize the server app

/*============= Middlewares used ============= */
// CORS configuration - allow specific origins in production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // cors middleware to access resources from different origins

// Request size limits for security
app.use(express.json({ limit: '10mb' })); // json middleware to allow getting json in requests
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // url middleware to allow getting forms

/* ========= Health Check Endpoint ========= */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/* ========= Defined Middlewares ========= */
app.use(
  "/",
  userRouter,
  chatRouter
); 

/* ========= Error Handling Middleware ========= */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/* ========= 404 Handler ========= */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ========= App listener & port config ========= */
const PORT = process.env.PORT || 5000; // takes port value from .env file (fallback value : 5000)
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log("==========================================");
});
