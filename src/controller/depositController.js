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

const deposit = async (req, res, next) => {

    const depositInfo = req.body

    const { error } = validateDepositInfo(depositInfo);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const currentUser = db.find(userD => userD.email === depositInfo.email);
       
        if(!currentUser){

            return res.status(200).send({'message': 'user does not exists'});
        }

        let newBalance = Number(parseFloat(currentUser.balance) + depositInfo.amount).toFixed(2);
        console.log( 'new balance', newBalance );

        let data = {...currentUser, 'balance': newBalance};

        console.log('new data', data);

        if(!data){
            return res.status(200).send({'message': 'fail to deposit'});
        }

        let userIdx = db.findIndex(data => data.id === currentUser.id);
        db.splice(userIdx, 1, data);

        await fs.writeFile(database, JSON.stringify(db, null, 2), 'utf8');

        return res.status(200).json({
            'data': data.balance,
            'message': `Your deposit of $${depositInfo.amount} was successfully`
        });
    }


}


module.exports = deposit;