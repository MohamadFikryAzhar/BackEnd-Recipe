import client from './../config/database.js';

export const checkingDuplicateNameEmail = async (req, res, next) => {
    const {name, email} = req.body;

    const resultName = await client.query("SELECT name FROM users WHERE name=$1", [name]);
    const resultEmail = await client.query("SELECT email FROM users WHERE email=$1", [email]);

    if (resultName.rows[0]) {
        return res.status(400).json({statuscode: 400, message: "Name already exists"});
    }

    if (resultEmail.rows[0]) {
        return res.status(400).json({statuscode: 400, message: "Email already exists"});
    }

    next();
}