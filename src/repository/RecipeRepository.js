import {v4 as uuidv4} from 'uuid';
import client from '../config/database.js';

export class GetRecipeRepository {
    static getAllRecipe = async () => {
        try {
            const result = await client.query("SELECT * FROM recipe");
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static getSortedData = async (data) => {
        const {sortBy, sort, offset, limit} = data;
        
        try {
            const result = await client.query(`SELECT * FROM recipe 
                                                WHERE ${sortBy} ILIKE '%${sort}%' 
                                                OFFSET ${offset} LIMIT ${limit}`);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static getRecipeByCategory = async (category) => {
        try {
            const result = await client.query(`SELECT * FROM recipe 
                                                WHERE category=$1`, [category]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static getRecipeByUser = async (user_name, data) => {
        const {offset, limit} = data;

        try {
            const result = await client.query(`SELECT * FROM recipe 
                                                WHERE user_name = '${user_name}' 
                                                OFFSET ${offset} LIMIT ${limit}`);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static getRecipeBySearch = async (data = null) => {
        const {search, sortby, sort, offset, limit} = data;
        
        try {
            if (search !== undefined){
                const result = await client.query(`SELECT * FROM recipe WHERE to_tsvector(title) @@ to_tsquery($1) 
                                                    UNION SELECT * FROM recipe WHERE to_tsvector(ingredients) @@ to_tsquery($1) 
                                                    UNION SELECT * FROM recipe WHERE to_tsvector(image_path) @@ to_tsquery($1);`, 
                                                    [search]);
                return result;
            }
            
            const result =  await client.query(`SELECT * FROM recipe 
                                                ORDER BY ${sortby} ${sort} 
                                                OFFSET ${offset} LIMIT ${limit}`);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static getRecipeById = async (id) => {
        try {
            const result = await client.query("SELECT * FROM recipe WHERE id=$1", [id]);
            return result;
        } catch (error) {
            throw Error(error.message);            
        }
    }
}

export class RecipeRepository {
    static postRecipe = async (data) => {
        const {title, ingredients, image_path, category, user_name, cloudinary_id} = data;
        let id = uuidv4();
        
        try {
            const result = await client.query(`INSERT INTO recipe (id, title, ingredients, 
                                                image_path, category, user_name, cloudinary_id) 
                                                VALUES ($1, $2, $3, $4, $5, $6, $7);`, [id, title, 
                                                ingredients, image_path, category, user_name, cloudinary_id]);
            return result;
        } catch (error) {
            throw Error(error.message);            
        }
    }
    
    static putRecipe = async (data, id) => {
        const {title, ingredients, image_path, category, cloudinary_id} = data;
        
        try {
            const result = await client.query(`UPDATE recipe SET 
                                                title=$1, ingredients=$2, image_path=$3, category=$4, cloudinary_id=$5, updated_at=NOW() 
                                                WHERE id=$6;`, [title, ingredients, image_path, category, cloudinary_id, id]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
    
    static deleteRecipe = async (id) => {
        try {
            const result = await client.query("DELETE FROM recipe CASCADE WHERE id=$1", [id]);
            return result;
        } catch (error) {
            throw Error(error.message);
        }
    }
}