import {hashPassword} from '../helper/AuthAction.js';
import {v4 as uuidv4} from 'uuid';
import client from './../config/database.js';

export class UserRepository {
    static getAllUser = async () => {
        const result = await client.query("SELECT * FROM users");
    
        return result;
    }
    
    static getUserById = async (value) => {
        const result = await client.query("SELECT * FROM users WHERE id=$1", [value]);
    
        return result;
    }
    
    static createUser = async (data) => {
        const {name, email, password} = data;
        const hashedPassword = hashPassword(password);
        const id = uuidv4();
    
        const result = await client.query("INSERT INTO users(id, name, email, password, role_name) VALUES($1, $2, $3, $4, 'user')", [id, name, email, hashedPassword]);
    
        return result;
    }
    
    static updateUser = async (data, id) => {
        const {name, email, photo, photo_id} = data;
    
        const result = await client.query("UPDATE users SET name=$1, email=$2, photo=$3, photo_id=$4 WHERE id=$5", [name, email, photo, photo_id, id]);
    
        return result;
    }

    static deleteUser = async (id) => {
        const result = await client.query("DELETE FROM users CASCADE WHERE id=$1", [id]);
        
        return result;
    }
};

export class ActionUserRepository {
    static updateToVerified = async (id) => {
        const result = await client.query("UPDATE users SET verified=true WHERE id=$1", [id]);
    
        return result;
    }
}