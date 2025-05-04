// This file contains the schema for the database tables using Drizzle ORM.
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

/* ========= chats table creation ========= */ 
export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    message: text('message').notNull(),
    reply: text('aiReply').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isMigrated: boolean('is_migrated').default(false),
});

/*  ======== users table creation ========== */
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isMigrated: boolean('is_migrated').default(false),
});


/* ======  drizzle queries inference ======== */
    // chats table queries
export type ChatInsert = typeof chats.$inferInsert;
export type ChatSelect = typeof chats.$inferSelect;
    // users table queries
export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
