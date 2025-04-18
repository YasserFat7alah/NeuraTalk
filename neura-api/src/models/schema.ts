// This file contains the schema for the database tables using Drizzle ORM.
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/* ========= chats table creation ========= */ 
export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    message: text('message').notNull(),
    reply: text('aiReply').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

/*  ======== users table creation ========== */
export const users = pgTable('users', {
    userId : text('user_id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});


/* ======  drizzle queries inference ======== */
    // chats table queries
export type ChatInsert = typeof chats.$inferInsert;
export type ChatSelect = typeof chats.$inferSelect;
    // users table queries
export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
