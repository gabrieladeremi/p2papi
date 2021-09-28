const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const readFile = async () => {
    try {
        const data = await fs.readFile(database, 'utf8');
        console.log('direct', data);
        return JSON.parse(data);
    } catch (error) {
        if(error){
            console.log(error);
        }
    }
}
const userAuthentication = async (req,res) => {

    if(req.headers.authorization){

        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = await readFile();

            if(Object.keys(db).length !== 0) {
         
                const currentUser = user.find(userD => userD.id === decodedToken.id);
        
                if(!currentUser){
        
                    return res.status(400).json('no token provided');
                }
                req.user = currentUser;
            }
            
        } catch (error) {

            return res.status(400).json({'error':err});
        }
    }else{
        return res.status(400).json('not Authorized');
    }
    next();
}


module.exports = userAuthentication;
