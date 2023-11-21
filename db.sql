CREATE TABLE recipe(
    id VARCHAR PRIMARY KEY NOT NULL,
    title VARCHAR(150) UNIQUE,
    ingredients TEXT,
    image_path VARCHAR,
    cloudinary_id VARCHAR,
    category VARCHAR NOT NULL,
    user_name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

ALTER TABLE recipe ADD CONSTRAINT category_name_fkey FOREIGN KEY (category) REFERENCES category(name);
ALTER TABLE recipe ADD CONSTRAINT user_name_fkey FOREIGN KEY (user_name) REFERENCES users(name) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE recipe ADD COLUMN image_id VARCHAR;

SELECT * FROM recipe;

CREATE TABLE category(
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE INDEX category_name_index ON category(name);

CREATE TABLE users(
    id VARCHAR PRIMARY KEY NOT NULL,
    name VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    role_name VARCHAR(100),
    photo VARCHAR,
    photo_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

SELECT * FROM users;
UPDATE users SET verified = true WHERE name = 'fikry a';
CREATE INDEX user_role_index ON users(role_name);
ALTER TABLE users ADD CONSTRAINT role_name_fkey FOREIGN KEY (role_name) REFERENCES roles(role_name);
ALTER TABLE users ADD COLUMN verified BOOLEAN;

CREATE TABLE roles(
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    role_name VARCHAR UNIQUE
);

CREATE INDEX roles_name_index ON roles(role_name);

INSERT INTO category (id, name) VALUES (md5(random()::text), 'Main course'), (md5(random()::text), 'Appetizer'), (md5(random()::text), 'Dessert');
INSERT INTO roles(id, role_name) VALUES(md5(random()::text), 'user');
INSERT INTO users (id, name, email, password, role_name, verified)
VALUES (md5(random()::text), 'mfikry', 'azharfikry6@gmail.com', 'bismillahespot', 'user', true);

SELECT * FROM recipe;
TRUNCATE recipe CASCADE;
SELECT * FROM recipe WHERE title ILIKE '%%' OFFSET 2 LIMIT 10;
SELECT * FROM recipe WHERE category='Main course';
SELECT * FROM recipe WHERE user_name = 'fikry azhar' OFFSET 1 LIMIT 10;

SELECT * FROM category;

SELECT * FROM users;
TRUNCATE users CASCADE;
DELETE FROM users WHERE name='fikry';
UPDATE users SET verified = true WHERE name = 'fikry';

SELECT * FROM roles;
INSERT INTO roles(id, role_name) VALUES(md5(random()::text), 'user');