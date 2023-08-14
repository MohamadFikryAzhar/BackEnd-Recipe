import * as recipeRepository from './../repository/RecipeRepository.js';
import cloudinary from '../config/cloudinaryconfig.js';

export const allRecipe = async (req, res) => {
    let recipeData = await recipeRepository.getAllRecipe();

    return res.status(200).json({statuscode: 200, data: recipeData.rows});
}

export const sortedRecipe = async (req, res) => {
    const {sortBy, sort, offset, limit} = req.query;

    const pageSearched = offset || 1;
    const limitation = limit || 5;

    const data = {
        sortBy: sortBy || 'title',
        sort: sort || '',
        offset: (pageSearched - 1) * limitation,
        limit: limit || 5
    }

    let recipeSortedData = await recipeRepository.getSortedData(data);

    return res.status(200).json({statuscode: 200, message: "success getting data", data: recipeSortedData.rows});
}

export const categorizedRecipe = async (req, res) => {
    const {category} = req.query;

    const recipeCategorized = await recipeRepository.getRecipeByCategory(category);

    return res.status(200).json({statuscode: 200, message: "success getting data by category", data: recipeCategorized.rows});
}

export const recipeByUser = async (req, res) => {
    const {user_name, page, limit} = req.query;
    
    const pageSearched = page || 1;
    const limitation = limit || 5

    const data = {
        offset: (pageSearched - 1) * limitation,
        limit: limit || 5
    }

    const recipeUser = await recipeRepository.getRecipeByUser(user_name, data);

    return res.status(200).json({statuscode: 200, message: "success getting data by user", data: recipeUser.rows});
}

export const recipePage = async (req, res) => {
    const {sortBy, sort, page, limit} = req.query;

    const pageSearched = page || 1;
    const limitation = limit || 5;

    const data = {
        sortBy: sortBy || 'title',
        sort: sort || '',
        offset: (pageSearched - 1) * limitation,
        limit: limit || 5
    };

    let dataRecipe = await recipeRepository.getAllRecipe();
    let sortedData = await recipeRepository.getSortedData(data);
    
    let pagination = {
        totalPage: Math.ceil(dataRecipe.rowCount / limitation),
        totalData: parseInt(sortedData.rowCount),
        currentPage: parseInt(pageSearched)
    }

    if (sortedData.rows.length > 0) {
        return res.status(200).json({statuscode: 200, message: "success getting data", data: sortedData.rows, pagination});
    } else {
        return res.status(400).json({statuscode: 400, message: "data not found"});
    }
}

export const recipePageBySearch = async (req, res) => {
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
    
    const result = await recipeRepository.getRecipeBySearch(data);

    return res.status(200).json({statuscode: 200, message: "Success getting all data recipe", data: result.rows})
}

export const recipePageById = async (req, res) => {
    const {id} = req.params;

    if (!id) return res.status(400).json({ statuscode: 400, message: "id wrong"});

    const result = await recipeRepository.getRecipeById(id);

    return res.status(200).json({statuscode: 200, message: "Success getting data recipe", data: result.rows[0]})
}

export const addRecipe = async (req, res) => {
    try {
        const {title, ingredients, category} = req.body;
        const image_path = await cloudinary.uploader.upload(req.file.path);
        let user_name = req.user.name;
    
        if (!title || !ingredients || !image_path || !category) return res.status(400).json({statuscode: 400, message: "title, ingredients, image_path, and category is required"});
        
        let data = {
            title: title,
            ingredients: ingredients,
            image_path: image_path.secure_url,
            cloudinary_id: image_path.public_id,
            category: category,
            user_name
        }
        console.log(data);
    
        await recipeRepository.postRecipe(data);
        return res.status(201).json({statuscode: 201, message: "success creating data recipe", data: data})
    } catch (error) {
        return res.status(400).json({statuscode: 400, message: error.message});
    }
}

export const updateRecipe = async (req, res) => {
    try {
        const {id} = req.params;
        let { title, ingredients, category} = req.body;
        let user_name = req.user.name;
        let recipeId = await recipeRepository.getRecipeById(id);
        
        if (!id) return res.status(400).json({statuscode: 400, message: "id wrong"});

        if (!req.file) {
            if (user_name != recipeId.rows[0].user_name) {
                return res.status(401).json({statuscode: 401, message: "Not your recipe"})
            }

            let data = {
                title: title || recipeId.rows[0].title,
                ingredients: ingredients || recipeId.rows[0].ingredients,
                image_path: recipeId.rows[0].image_path,
                cloudinary_id: recipeId.rows[0].cloudinary_id,
                category: category || recipeId.rows[0].category
            };
            
            await recipeRepository.putRecipe(data, id);

            delete data.id;
            delete data.cloudinary_id;

            return res.status(200).json({statuscode: 200, message: "success updating data recipe", data: data})
        } else {
            if (!req.fileValid) {
                return res.status(400).json({statuscode: 400, message: "Must be image"})
            }

            if (user_name != recipeId.rows[0].user_name) {
                return res.status(401).json({statuscode: 401, message: "Not your recipe"})
            }
            
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
            
            await recipeRepository.putRecipe(data, id);

            delete data.id;
            delete data.cloudinary_id;

            return res.status(200).json({statuscode: 200, message: "success updating data recipe", data: data})
        }
    } catch (error) {
        return res.status(400).json({statuscode: 400, message: error.message});
    }
}

export const removeRecipe = async (req, res) => {
    const {id} = req.params;
    let recipeId = await recipeRepository.getRecipeById(id);
    let user_name = req.user.name;

    try {
        if (!id) return res.status(400).json({statuscode: 400, message: "id wrong"});

        if (user_name != recipeId.rows[0].user_name) {
            return res.status(401).json({statuscode: 401, message: "Not your recipe"})
        }

        await cloudinary.uploader.destroy(recipeId.rows[0].cloudinary_id);
        await cloudinary.uploader.destroy(recipeId.rows[0].image_path);
        await recipeRepository.deleteRecipe(id);
    
        return res.status(202).json({statuscode: 202, message: "success deleting data recipe"})
    } catch (error) {
        return res.status(400).json({statuscode: 400, message: error.message});
    }
}