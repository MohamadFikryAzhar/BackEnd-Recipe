CREATE TABLE recipe(
    id VARCHAR PRIMARY KEY NOT NULL,
    title VARCHAR(255) UNIQUE,
    ingredients TEXT,
    image_path VARCHAR,
    image_id VARCHAR,
    cloudinary_id VARCHAR,
    category VARCHAR NOT NULL,
    user_name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_name) REFERENCES users(name),
    FOREIGN KEY (category) REFERENCES category(name)
);

CREATE TABLE users (
id VARCHAR PRIMARY KEY NOT NULL,
name VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR UNIQUE,
password VARCHAR,
role_name VARCHAR(255),
photo VARCHAR,
photo_id VARCHAR,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP,
deleted_at TIMESTAMP,
FOREIGN KEY (role_name) REFERENCES roles(role_name)
);

CREATE TABLE roles(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    role_name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE category(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX category_name_index ON category(name);
CREATE INDEX user_role_index ON users(role_name);
CREATE INDEX roles_name_index ON roles(role_name);

INSERT INTO users (id, name, email, password, role_name)
VALUES (1, 'Fikry Azhar', 'azharfikry6@gmail.com', 'jayajayajayajayajaya', 'user'), (2, 'Mama Recipe', 'mamahmuda@gmail.com', 'tukangbikinmakanan', 'chef'), (3, 'Indah Purnama', 'indahsajaakusi@gmail.com', 'supersemar123', 'admin');

INSERT INTO roles(id, role_name) VALUES(md5(random()::text), 'user');
INSERT INTO roles(id, role_name) VALUES(md5(random()::text), 'admin');
INSERT INTO roles(id, role_name) VALUES(md5(random()::text), 'chef');

INSERT INTO recipe (id, title, ingredients, category, user_name) VALUES (1, 'Sandwich with egg', 'Egg, Bread, Sauce, Mayyonaise, Lettuce', 'Main course', 'Fikry Azhar'), (2, 'Omelette', 'Egg', 'Main course', 'Indah Purnama'), (3, 'Scrambbled Egg', 'Egg', 'Appetizer', 'Mama Recipe');

INSERT INTO category (id, name) VALUES (1, 'Appetizer'), (2, 'Main course'), (3, 'Dessert');
