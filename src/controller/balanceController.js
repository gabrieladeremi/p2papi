const express = require('express');
const fs = require('fs').promises;
const path = require("path");
const database = path.join(__dirname, "../", "config/db.json");

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
    let currentUserId = req.user.id;

    let db = await readFile();

    let user = db.find(data => data.id === currentUserId);

    return res.status(200).json({
        'message': `Your Available balance is $${user.balance}`
    }); 
}

module.exports = balance;