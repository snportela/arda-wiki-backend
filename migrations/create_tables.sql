CREATE EXTENSION unaccent;

CREATE TABLE "races" (
	race_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL
);

CREATE TABLE "periods" (
	period_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL
);

CREATE TABLE "events" (
	event_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL,
	period_id INTEGER[] NULL
);

CREATE TABLE "weapons" (
	weapon_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL
);

CREATE TABLE "locations" (
	location_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL,
	image TEXT NULL,
	race_id INTEGER[]NULL
);

CREATE TABLE "characters" (
	character_id serial PRIMARY KEY,
	name VARCHAR(200) NULL,
	description TEXT NULL,
	image TEXT NULL,
	weapon_id INTEGER[]NULL,
	location_id INTEGER[]NULL,
	race_id INTEGER, 
  	 CONSTRAINT fk_race_id
     FOREIGN KEY (race_id) 
     REFERENCES races (race_id)
);

CREATE TABLE "users" (
    user_id serial PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);