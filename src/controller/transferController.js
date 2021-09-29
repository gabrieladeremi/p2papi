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

    const { amount, email } = req.body;

    console.log('userId', req.user.id);

    const { error } = validateDepositInfo(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const receiver = db.find(userD => userD.email === email);
       
        if(!receiver) {

            return res.status(404).send({'message': 'receiver cannot be confirmed'});
        }

        if(Object.keys(db).length !== 0) {
             
            const sender = db.find(userD => userD.id === req.user.id);
    
            if(sender.balance < amount){
                return res.status(400).send({'message': 'Insufficient balance'});
            }
    
            let transferDebit = Number(parseFloat(sender.balance) - amount).toFixed(2);
    
            let data = {...sender, 'balance': transferDebit};
    
            console.log('new data', data);
    
            if(!data){
                return res.status(200).send({'message': 'could not debit account'});
            }
    
            let userIdx = db.findIndex(data => data.id === sender.id);
            db.splice(userIdx, 1, data);
    
            let creditReceiver = Number(parseFloat(receiver.balance) + amount).toFixed(2);

            let receiverData = {...receiver, 'balance': creditReceiver};
    
            console.log('new data', receiverData);
    
            if(!receiverData){
                return res.status(200).send({'message': 'could not debit account'});
            }
    
            let receiverUserIdx = db.findIndex(record => record.id === receiver.id);
            db.splice(receiverUserIdx, 1, receiverData);

            await fs.writeFile(database, JSON.stringify(db, null, 2), 'utf8');

            return res.status(200).json({
                'sender balance': `$${data.balance}`,
                'receiver balance': `$${receiverData.balance}`,
                'message': `Your transfer of $${amount} was successfully`
            });
    
        }

    }
    
}

module.exports = transfer;