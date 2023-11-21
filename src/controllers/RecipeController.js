import {GetRecipeRepository, RecipeRepository} from './../repository/RecipeRepository.js';
import cloudinary from '../config/cloudinaryconfig.js';
import { getCache, setCache } from '../helper/CacheAction.js';

export class RecipeGetController {    
    static allRecipe = async (req, res) => {
        let recipeData = await GetRecipeRepository.getAllRecipe();
        setCache("recipes_data", recipeData.rows);
        
        try {
            let getCachedRecipes = getCache("recipes_data")
    
            return res.respond({
                statuscode: 200, 
                message: "Success getting all recipe",
                data: getCachedRecipes
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static sortedRecipe = async (req, res) => {
        const {sortBy, sort, offset, limit} = req.query;
    
        const pageSearched = offset || 1;
        const limitation = limit || 5;
    
        const data = {
            sortBy: sortBy || 'title',
            sort: sort || '',
            offset: (pageSearched - 1) * limitation,
            limit: limit || 5
        }
    
        let recipeSortedData = await GetRecipeRepository.getSortedData(data);
        setCache("recipe_sorted_data", recipeSortedData.rows);

        try {
            let getCachedSortedRecipes = getCache("recipe_sorted_data")
        
            return res.respond({
                statuscode: 200, 
                message: "success getting sorted recipe", 
                data: getCachedSortedRecipes
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static categorizedRecipe = async (req, res) => {
        const {category} = req.query;
        const recipeCategorized = await GetRecipeRepository.getRecipeByCategory(category);
        setCache("recipe_category_data", recipeCategorized.rows);

        try {
            let getCachedCategorizedRecipes = getCache("recipe_category_data")
        
            return res.respond({
                statuscode: 200, 
                message: "success getting recipe by category", 
                data: getCachedCategorizedRecipes
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static recipeByUser = async (req, res) => {
        const {user_name, page, limit} = req.query;
        
        const pageSearched = page || 1;
        const limitation = limit || 5;
    
        const data = {
            offset: (pageSearched - 1) * limitation,
            limit: limit || 5
        }
    
        const recipeUser = await GetRecipeRepository.getRecipeByUser(user_name, data);
        setCache("recipe_user_data", recipeUser.rows);

        try {
            let getCachedUserRecipes = getCache("recipe_user_data");
        
            return res.respond({
                statuscode: 200, 
                message: `Success getting recipe that made by ${user_name}`, 
                data: getCachedUserRecipes
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static recipePage = async (req, res) => {
        const {sortBy, sort, page, limit} = req.query;
    
        const pageSearched = page || 1;
        const limitation = limit || 5;
    
        const data = {
            sortBy: sortBy || 'title',
            sort: sort || '',
            offset: (pageSearched - 1) * limitation,
            limit: limit || 5
        };
    
        let dataRecipe = await GetRecipeRepository.getAllRecipe();
        let sortedData = await GetRecipeRepository.getSortedData(data);

        setCache("recipe_all_data", dataRecipe.rowCount);
        let getCachedAllRecipe = getCache("recipe_all_data")
        setCache("recipe_sorted_all_data", sortedData.rowCount);
        let getCachedAllSortedRecipe = getCache("recipe_sorted_all_data")
        setCache("recipe_sorted_rows_data", sortedData.rows);
        let getCachedAllSortedRecipeRows = getCache("recipe_sorted_rows_data")
        setCache("recipe_sorted_rows_length_data", sortedData.rows.length);
        let getCachedAllSortedRecipeRowsLength = getCache("recipe_sorted_rows_length_data")
        
        let pagination = {
            totalPage: Math.ceil(getCachedAllRecipe / limitation),
            totalData: parseInt(getCachedAllSortedRecipe),
            currentPage: parseInt(pageSearched)
        }
    
        if (getCachedAllSortedRecipeRowsLength > 0) {
            return res.respond({
                statuscode: 200, 
                message: "success getting recipe", 
                data: getCachedAllSortedRecipeRows, 
                pagination: pagination
            });
        } else {
            return res.respond({
                statuscode: 204, 
                message: "Data none", 
            });
        }
    }
    
    static recipePageBySearch = async (req, res) => {
        const {search, sortby, sort, page, limit} = req.query;
    
        const pageSearched = page || 1;
        const limitation = limit || 5;
    
        let data = {
            search: search || undefined,
            sortby: sortby || 'title',
            sort: sort || 'asc',
            offset: (pageSearched - 1) * limitation || 1,
            limit: limit || 10
        }
        
        const result = await GetRecipeRepository.getRecipeBySearch(data);
        setCache("recipe_searched_data", result.rows);

        try {
            let getCachedSearchedRecipe = getCache("recipe_searched_data")
        
            return res.respond({
                statuscode: 200, 
                message: "Success getting recipe", 
                data: getCachedSearchedRecipe
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static recipePageById = async (req, res) => {
        const {id} = req.params;
    
        if (!id) return res.fail({statuscode: 400, message: "Id wrong"})
        
        try {
            const result = await GetRecipeRepository.getRecipeById(id);
        
            return res.respond({
                statuscode: 200, 
                message: "Success getting recipe", 
                data: result.rows[0]
            })
        } catch (err) {
            throw err.message;
        }
    }
}

export class RecipeController {
    static addRecipe = async (req, res) => {
        try {
            const {title, ingredients, category} = req.body;
            const image_path = await cloudinary.uploader.upload(req.file.path);
            let user_name = req.user.name;
        
            if (!title || !ingredients || !image_path || !category) return res.fail({statuscode: 400, message: "Must filled"})
            
            let data = {
                title: title,
                ingredients: ingredients,
                image_path: image_path.secure_url,
                cloudinary_id: image_path.public_id,
                category: category,
                user_name
            }
        
            await RecipeRepository.postRecipe(data);

            return res.respondCreated({
                statuscode: 201, 
                message: "success creating data recipe", 
                data: data
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static updateRecipe = async (req, res) => {
        try {
            const {id} = req.params;
            let { title, ingredients, category} = req.body;
            let user_name = req.user.name;
            let recipeId = await GetRecipeRepository.getRecipeById(id);
            
            if (!id) return res.fail({statuscode: 400, message: "Id wrong"})
    
            if (!req.file) {
                if (user_name != recipeId.rows[0].user_name) return res.failUnauthorized({
                        statuscode: 401, 
                        message: "Not your recipe"
                    })
    
                let data = {
                    title: title || recipeId.rows[0].title,
                    ingredients: ingredients || recipeId.rows[0].ingredients,
                    image_path: recipeId.rows[0].image_path,
                    cloudinary_id: recipeId.rows[0].cloudinary_id,
                    category: category || recipeId.rows[0].category
                };
                
                await RecipeRepository.putRecipe(data, id);
    
                delete data.id;
                delete data.cloudinary_id;
    
                return res.respond({
                    statuscode: 200, 
                    message: "success updating data recipe", 
                    data: data
                })
            } else {
                if (!req.fileValid) return res.fail({statuscode: 400, message: "Image file should named *.png, *.jpg, *.jpeg, *.jfif"})
    
                if (user_name != recipeId.rows[0].user_name) return res.respondUnauthorized({
                        statuscode: 401, 
                        message: "Not your recipe"
                    })
                
                await cloudinary.uploader.destroy(recipeId.rows[0].cloudinary_id);
                await cloudinary.uploader.destroy(recipeId.rows[0].image_path);
                const image_path = await cloudinary.uploader.upload(req.file.path);
                
                let data = {
                    title: title || recipeId.rows[0].title,
                    ingredients: ingredients || recipeId.rows[0].ingredients,
                    image_path: image_path.secure_url,
                    cloudinary_id: image_path.public_id,
                    category: category || recipeId.rows[0].category
                };
                
                await RecipeRepository.putRecipe(data, id);
    
                delete data.cloudinary_id;
    
                return res.respond({
                    statuscode: 200, 
                    message: "success updating data recipe", 
                    data: data
                })
            }
        } catch (err) {
            throw err.message;
        }
    }
    
    static removeRecipe = async (req, res) => {
        const {id} = req.params;
        let recipeId = await GetRecipeRepository.getRecipeById(id);
        let user_name = req.user.name;
    
        try {
            if (!id) return res.fail({statuscode: 400, message: "Id wrong"})
    
            if (user_name != recipeId.rows[0].user_name) return res.respondUnauthorized({
                    statuscode: 401, 
                    message: "Not your recipe"
                })
    
            await cloudinary.uploader.destroy(recipeId.rows[0].cloudinary_id);
            await cloudinary.uploader.destroy(recipeId.rows[0].image_path);
            await RecipeRepository.deleteRecipe(id);
        
            return res.respond({
                statuscode: 202, 
                message: "success deleting data recipe"
            })
        } catch (err) {
            throw err.message
        }
    }
}