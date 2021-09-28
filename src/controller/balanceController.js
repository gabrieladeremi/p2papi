const express = require('express');
const fs = require('fs').promises;
const path = require("path");
const database = path.join(__dirname, "../", "config/db.json");
const {validateDepositInfo} = require('../Utils/validator');

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

const balance = async (req, res) => {
    let currentUser = req.user.id;

    let db = await readFile();

    let user = db.find(data => data.id === currentUser);

    return res.status(200).json({
        'message': `Your Available balance is $${user.balance}`
    }); 
}

module.exports = balance;