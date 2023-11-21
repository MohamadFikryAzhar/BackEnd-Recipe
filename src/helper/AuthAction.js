import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtConf from '../config/jwtconfig.js';

dotenv.config();

export const generateToken = dataUser => {
    const token = jwt.sign(dataUser, jwtConf.setSecretKey(process.env.JWT_KEY), {
        algorithm: 'HS256', 
        allowInsecureKeySizes: true, 
        expiresIn: jwtConf.setExpiration('3d')
    });
    
    return token
}

export const comparePassword = (userPassword, databasePassword) => {
    return bcrypt.compareSync(userPassword, databasePassword);
}

export const hashPassword = value => bcrypt.hashSync(value, 12);

export const isAnySpace = value => value.match(/\s/g);