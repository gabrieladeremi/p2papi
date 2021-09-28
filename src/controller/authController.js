const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const path = require("path");
const database = path.join(__dirname, "../", "config/db.json");
const {validateUserInfo, validateUserLoginInfo } = require('../Utils/validator');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function idGenerator(data) {

    let idx = 0;
    let len = data.length + 1;

    return {
        next: function() {
            return idx < len ? 
            { value: len, done: false } : 
            { done: true };
        }
    }
}


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
const signUp = async(req, res) => {

    const userData = {...req.body};

    const db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const checkFile = db.some(userD => userD.email === userData.email);

        if(checkFile){

            return res.status(200).send({'message': 'user already exists'});
        }
    }

    const { error } = validateUserInfo(userData);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (userData.password !== userData.confirmPassword) {
        return res.status(400).send('confirmPassword does not match password');
    }

    let generator = idGenerator(db);

    let id = generator.next().value;

    let data = {
        id: id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        email: userData.email,
        balance: '0.00',
        password: await bcrypt.hash(userData.password, 12)

    };
     
    let saved = db.push(data);
    
    await fs.writeFile(database, JSON.stringify(db, null, 2), 'utf8');
    res.status(200).send(db);
 
}

const signIn = async(req, res) => {

    const userData = {...req.body };

    const { error } = validateUserLoginInfo(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    const savedUser = await readFile();

    if(Object.keys(savedUser).length !== 0) {
         
        const currentUser = savedUser.find(userD => userD.email === userData.email);

        if(!currentUser){

            return res.status(200).send({'message': 'user does not exist'});

        } else {
            
            const validPassword = await bcrypt.compare(userData.password, currentUser.password);

            if(!validPassword) {
                return res.status(400).send('Invalid credentials')
            }
            
            const token = jwt.sign({
                email: currentUser.email,
                id: currentUser.id,
            }, process.env.JWT_SECRET_KEY, {expiresIn: "3h"});

            res.status(200).json({
                token,
                'status':'success',
                'user': {
                    'firstName': currentUser.firstName,
                    'lastName': currentUser.lastName,
                    'email': currentUser.email,               
                    'id' : currentUser.id       
                }
            });

        }
    }
}




module.exports = {
    signUp,
    signIn
}