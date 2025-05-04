CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"aiReply" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_migrated" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_migrated" boolean DEFAULT false
);
