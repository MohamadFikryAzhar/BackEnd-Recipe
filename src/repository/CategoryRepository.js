import client from '../config/database.js';

export const getAllCategory = async () => {
    try {
        const result = await client.query("SELECT * FROM category");
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}