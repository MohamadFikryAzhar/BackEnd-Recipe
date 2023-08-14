import { ActionUserRepository, UserRepository} from './../repository/UserRepository.js';
import {generateToken, comparePassword } from './../helper/AuthAction.js';
import client from './../config/database.js';
import cloudinary from '../config/cloudinaryconfig.js';
import sendToMail from '../helper/SendToMail.js';
import dotenv from 'dotenv';
dotenv.config();

export class UserController {
    static getUsers = async (req, res) => {
        const result = await UserRepository.getAllUser();
    
        return res.status(200).json({statuscode: 200, message: "Success getting all user", data: result.rows});
    }
    
    static getUser = async (req, res) => {
        const {id} = req.user;
        if (!id) return res.status(400).json({statuscode: 400, message: "id wrong"});
    
        const result = await UserRepository.getUserById(id);

        delete result.rows.password

        return res.status(200).json({statuscode: 200, message: "User you request is", data: result.rows});
    }
    
    static registerUser = async (req, res) => {
        const {name, email, password} = req.body;
        const data = {
            name: name || undefined,
            email: email || undefined,
            password: password || undefined
        }
        
        await UserRepository.createUser(data);
        
        const resultName = await client.query("SELECT * FROM users WHERE email=$1", [email]);

        delete resultName.rows[0].password;

        sendToMail(resultName.rows[0].email, "Verify Email", `https://maroon-salamander-gear.cyclic.app/verify/${resultName.rows[0].id}`);
        return res.status(201).json({statucode: 201, message: "An Email sent to your account, please verify"})
    }
    
    static loginUser = async (req, res) => {
        const {email, password} = req.body;
    
        const resultName = await client.query("SELECT * FROM users WHERE email=$1", [email]);
        if (!resultName.rows[0]) return res.status(404).json({statuscode: 404, message: "User not found"});
        if (!resultName.rows[0].verified) return res.status(400).json({statuscode: 400, message: "activate your account first"});
    
        const passwordValid = comparePassword(password, resultName.rows[0].password);
        if (!passwordValid) return res.status(400).json({statuscode: 400, message: "Invalid password"});
    
        const token = generateToken(resultName.rows[0]);
     
        delete resultName.rows[0].password;
        delete resultName.rows[0].photo_id;
        delete resultName.rows[0].deleted_at;
    
        return res.status(200).json({statuscode: 200, message: "Success Login, here is your token", data: resultName.rows[0], accesstoken: token});
    }
    
    static editUser = async (req, res) => {
        const {id} = req.user;
        const {name, email, password} = req.body;
        const photo = await cloudinary.uploader.upload(req.file.path);
    
        if (!id) return res.status(400).json({statuscode: 400, message: "id wrong"});
    
        let userId = await UserRepository.getUserById(id);
    
        let data = {
            name: name || userId.rows[0].name,
            email: email || userId.rows[0].email,
            password: password || userId.rows[0].password,
            photo: photo.secure_url || userId.rows[0].photo,
            photo_id: photo.public_id || userId.rows[0].photo_id
        };
    
        await UserRepository.updateUser(data, id);
    
        delete data.id;
    
        return res.status(200).json({statuscode: 200, message: "Success updating user account"})
    }
    
    static removeUser = async (req, res) => {
        const {id} = req.user;
    
        await UserRepository.deleteUser(id);
    
        return res.status(202).json({statuscode: 202, message: "Success delete account"})
    }
}

export class ActionUserController {
    static activateUser = async (req, res) => {
        const {id} = req.params;
        try {
            const resultId = await UserRepository.getUserById(id);
            if (!resultId) return res.status(400).send("Invalid Link");
    
            const verifiedUser = await ActionUserRepository.updateToVerified(id);
            if (!verifiedUser) return res.status(400).send("Email verified failed");
    
            return res.status(200).send("Email verified successfully");
        } catch (error) {
            return res.status(400).send("An error occured, register please");
        }
    }
}