DROP DATABASE IF EXISTS foodfy
CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
	"id" SERIAL PRIMARY KEY,
    "chef_id" int NOT NULL,
    "image" text NOT NULL,
    "title" text NOT NULL,
    "ingredients" text[] NOT NULL,
    "preparation" text[] NOT NULL,
    "information" text,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "avatar_url" text NOT NULL,
    "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
	"id" SERIAL PRIMARY KEY,
    "name" text,
    "path" text NOT NULL
);

CREATE TABLE "recipes_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" int REFERENCES "recipes"("id"),
    "file_id" int REFERENCES "files"("id")
);


ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id")REFERENCES "chefs"("id");
ALTER TABLE "recipes" DROP COLUMN "image";
ALTER TABLE "chefs" DROP COLUMN "avatar_url";
ALTER TABLE "chefs" ADD COLUMN "file_id" int REFERENCES "files"("id");

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "reset_token" text,
    "reset_token_expires" text,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "recipes" ADD COLUMN "user_id" int REFERENCES "users"("id");

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- cascade effect when delete user and recipes
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_recipe_id_fkey,
ADD CONSTRAINT recipes_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

-- to run seeds
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM files;
DELETE FROM recipes;
DELETE FROM recipes_files;

-- sequence restart auto_increment from tables ids
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_files_id_seq RESTART WITH 1;