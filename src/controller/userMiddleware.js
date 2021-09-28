const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require("path");
const database = path.join(__dirname, "../", "config/db.json");
const dotenv = require('dotenv');
dotenv.config();


const readFile = async () => {
    try {
        const data = await fs.readFile(database, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if(error){
            await fs.writeFile(database, JSON.stringify([]));
            const data = await fs.readFile(database, 'utf8');
            return JSON.parse(data);
        }
    }
}
const userAuthentication = async (req,res, next) => {

    if(req.headers.authorization){

        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = await readFile();

            if(Object.keys(user).length !== 0) {
         
                const currentUser = user.find(userD => userD.id === decodedToken.id);
                    
                if(!currentUser){
        
                    return res.status(400).json('no token provided');
                }
                req.user = currentUser;
            }
            
        } catch (error) {

            return res.status(400).json({'error':error});
        }
    }else{
        return res.status(400).json('not Authorized');
    }
    next();
}


module.exports = userAuthentication;
