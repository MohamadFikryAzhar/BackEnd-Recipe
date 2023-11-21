import {hashPassword} from '../helper/AuthAction.js';
import {v4 as uuidv4} from 'uuid';
import client from './../config/database.js';

export class UserRepository {
    static getAllUser = async () => {
        try {
            const result = await client.query("SELECT * FROM users");
            return result;
        } catch (error) {
            throw Error(error.message);                    
        }
    }
    
    static getUserById = async (value) => {
        try {
            const result = await client.query("SELECT * FROM users WHERE id=$1", [value]);
            return result;
        } catch (error) {
            throw Error(error.message)
        }
    }

    static createUser = async (data) => {
        const {name, email, password} = data;
        const hashedPassword = hashPassword(password);
        const id = uuidv4();
        
        try {
            const result = await client.query(`INSERT INTO users(id, name, email, password, role_name) 
                                               VALUES($1, $2, $3, $4, 'user')`, [id, name, email, hashedPassword]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static updateUser = async (data, id) => {
        const {name, photo} = data;
        
        try {
            const result = await client.query(`UPDATE users SET 
                                                name=$1, photo=$2
                                                WHERE id=$3`, [name, photo, id]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }

    static deleteUser = async (id) => {
        try {
            const result = await client.query("DELETE FROM users CASCADE WHERE id=$1", [id]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
};

export class ActionUserRepository {
    static updateToVerified = async (id) => {
        try {
            const result = await client.query("UPDATE users SET verified=true WHERE id=$1", [id]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
}