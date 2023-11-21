import {getAllCategory} from '../repository/CategoryRepository.js';

export const getCategories = async (req, res) => {
    try {
        const result = await getAllCategory();
    
        return res.respond({
            statuscode: 200, 
            message: "Success getting all category", 
            data: result.rows
        });
    } catch (err) {
        throw err.message;
    }
}