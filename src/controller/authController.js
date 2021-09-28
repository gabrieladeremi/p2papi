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


function idGen(data) {

    let idx = 0;

    return {
        next: function() {
            return idx < data.length ? 
            { value: idx + 1, done: false } : 
            { done: true };
        }
    }
}


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
const signUp = async(req, res) => {

    const userData = {...req.body};

    const db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const checkFile = db.some(userD => userD.email === userData.email);

        console.log('Checking file', checkFile);

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

    let generator = idGen(db);

    let id = generator.next().value;

    let data = {
        'id': id,
        'firstName':userData.firstName,
        'lastName':userData.lastName,
        'phone':userData.phone,
        'address':userData.address,
        'email':userData.email,
        'password': await bcrypt.hash(userData.password, 12)

    };

    // const file = await readFile();
     
    let saved = db.push(data);

    console.log('save', saved);
    
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

            let generator = idGen(savedUser);

            let id = generator.next().value;
            
            const token = jwt.sign({
                email: currentUser.email,
                id: id
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