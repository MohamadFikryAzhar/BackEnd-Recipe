import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtConf from '../config/jwtconfig.js';

dotenv.config();

const catchExpired = (err, res, next) => {
    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({statuscode: 401, message: "Authentication Failed, Token Expired!"});
    }

    next();
}

export const authenticateUser = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(403).json({statuscode: 403, message: "Please Provide the token"});
    }
    
    const accessToken = authorization.split(" ")[1];
    
    jwt.verify(accessToken, jwtConf.setSecretKey(process.env.JWT_KEY), (err, decoded) => {
        if (err) {
            return catchExpired(err, res);
        }

        req.user = decoded;
        next();
    })
}