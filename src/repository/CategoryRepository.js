import client from '../config/database.js';

export const getAllCategory = async () => {
    const result = await client.query("SELECT * FROM category");

    return result;
}