const express = require('express');
const {validateDepositInfo} = require('../Utils/validator');


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

const deposit = async (req, res, next) => {

    const depositInfo = req.body

    const { error } = validateDepositInfo(depositInfo);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const db = await readFile();

    if(Object.keys(db).length !== 0) {
         
        const currentUser = db.some(userD => userD.email === userData.email);

        if(!currentUser){

            return res.status(200).send({'message': 'user does not exists'});
        }

        let newBalance = currentUser.balance + depositInfo.amount;

        let data = {...currentUser, 'balance': newBalance};

        if(!data){
            return res.status(200).send({'message': 'fail to deposit'});
        }

        return res.status(200).json({
            'data': data.balance,
            'message': `Your deposit of ${depositInfo.amount} was successfully`
        });
    }


}


module.exports = deposit;