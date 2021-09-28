const express = require('express');
const fs = require('fs').promises;
const path = require("path");
const database = path.join(__dirname, "../", "config/db.json");
const {validateDepositInfo} = require('../Utils/validator');


const readFile = async () => {
    try {
        const data = await fs.readFile(database, 'utf8');
        console.log('direct', data);
        return JSON.parse(data);
    } catch (error) {
        if(error){
            await fs.writeFile(database, JSON.stringify([]));
            const data = await fs.readFile(database, 'utf8');
            return JSON.parse(data);
        }
    }
}

const transfer = async (req, res, next) => {

    const {email, amount } = req.body;

    const { error } = validateDepositInfo(depositInfo);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const currentUser = db.find(userD => userD.email === email);
       
        if(!currentUser){

            return res.status(200).send({'message': 'user does not exists'});
        }

        
    }

    
}

module.exports = transfer;