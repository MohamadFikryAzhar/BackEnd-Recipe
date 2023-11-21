import { ActionUserRepository, UserRepository} from './../repository/UserRepository.js';
import {generateToken, comparePassword, isAnySpace } from './../helper/AuthAction.js';
import client from './../config/database.js';
import cloudinary from '../config/cloudinaryconfig.js';
import sendToMail from '../helper/SendToMail.js';
import dotenv from 'dotenv';
dotenv.config();

export class UserController {
    static getUsers = async (req, res) => {
        UserRepository.getAllUser()
            .then(result => {
                const userData = result.rows;

                delete userData.password

                return res.respond({
                    statuscode: 200, 
                    message: "Success getting all user", 
                    data: userData
                });
            })
            .catch(err => {
                throw err.message
            })
    }
    
    static getUser = async (req, res) => {
        const {id} = req.user;
        if(!id) return res.fail({
            statuscode: 400, 
            message: "id wrong"
        });

        try {
            const result = await UserRepository.getUserById(id);
            delete result.rows.password;

            return res.respond({
                statuscode: 200, 
                message: "User you request is", 
                data: result.rows[0]
            });
        } catch (err) {
            throw err.message;
        }

    }
    
    static registerUser = async (req, res) => {
        const {name, email, password} = req.body;
        if (isAnySpace(name)) return res.fail({
            statuscode: 400, 
            message: "you cannot use space in you username"
        });

        const data = {
            name: name || undefined,
            email: email || undefined,
            password: password || undefined
        }

        try {
            await UserRepository.createUser(data);
            
            const resultName = await client.query("SELECT * FROM users WHERE email=$1", [email]);
            delete resultName.rows[0].password;

            sendToMail(resultName.rows[0].email, "Verify Email", `https://wild-puce-gorilla-boot.cyclic.app/verify/${resultName.rows[0].id}`);

            return res.respondCreated({
                statuscode: 201, 
                message: "An Email sent to your account, please verify"
            })
        } catch (err) {
            throw err.message;
        }
        

    }
    
    static loginUser = async (req, res) => {
        const {email, password} = req.body;
        
        const resultName = await client.query("SELECT * FROM users WHERE email=$1", [email]);
        if (!resultName.rows[0]) return res.fail({
            statuscode: 404, 
            message: "User not found"
        });
        if (!resultName.rows[0].verified) return res.fail({
            statuscode: 400, 
            message: "activate your account first"
        });
    
        const passwordValid = comparePassword(password, resultName.rows[0].password);
        if (!passwordValid) return res.fail({
            statuscode: 400, 
            message: "Invalid password"
        });
        
        const userData = resultName.rows[0];
        const token = generateToken(resultName.rows[0]);
        userData.token = token;

        delete userData.password;
        delete userData.photo_id;
        delete userData.deleted_at;
        
        try {
            return res.respond({
                statuscode: 200, 
                message: "Success Login, here is your token", 
                data: userData,
            });
        } catch (err) {
            throw err.message;
        }
    }
    
    static editUser = async (req, res) => {
        const {id} = req.user;
        const {name} = req.body;
        
        if (!id) return res.fail({
            statuscode: 400, 
            message: "id wrong"
        });
    
        let userId = await UserRepository.getUserById(id);
        
        try {
            if (!req.file) {
                let data = {
                    name: name || userId.rows[0].name,
                };
    
                await UserRepository.updateUser(data, id);
        
                return res.respondUpdated({
                    statuscode: 200, 
                    message: "Success updating user account"
                });
            } else {
                const photo = await cloudinary.uploader.upload(req.file.path);
    
                let data = {
                    name: name || userId.rows[0].name,
                    photo: photo.secure_url || userId.rows[0].photo,
                };
    
                await UserRepository.updateUser(data, id);
        
                return res.respondUpdated({
                    statuscode: 200, 
                    message: "Success updating user account"
                });
            }
        } catch (err) {
            throw err.message
        }
    }
    
    static removeUser = async (req, res) => {
        const {id} = req.user;
        
        try {
            await UserRepository.deleteUser(id);
        
            return res.respondDeleted({
                statuscode: 202, 
                message: "Success delete account"
            })
        } catch (err) {
            throw err.message;
        }
    }
}

export class ActionUserController {
    static activateUser = async (req, res) => {
        const {id} = req.params;

        const resultId = await UserRepository.getUserById(id);
        if (!resultId) return res.fail("Invalid Link");

        const verifiedUser = await ActionUserRepository.updateToVerified(id);
        if (!verifiedUser) return res.fail("Email verified failed");

        try {
            return res.respond("Email verified successfully");
        } catch (error) {
            throw error.message;
        }
    }
}