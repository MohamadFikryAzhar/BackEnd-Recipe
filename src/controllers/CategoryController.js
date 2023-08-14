import {getAllCategory} from '../repository/CategoryRepository.js';

export const getCategories = async (req, res) => {
    const result = await getAllCategory();

    return res.status(200).json({statuscode: 200, message: "Success getting all category", data: result.rows});
}