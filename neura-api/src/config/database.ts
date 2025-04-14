import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';
import {config} from 'dotenv';

config({path: '.env'});

// validate URL
if(!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is not defined');

// Init Neon client 
const sql = neon(process.env.DATABASE_URL);

// Init drizzle client
export const db = drizzle(sql);