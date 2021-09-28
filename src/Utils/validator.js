const Joi = require('joi');


const validateUserInfo = (userInfo) => {
    const schema = Joi.object({
        firstName: Joi.string().max(22).required(),
        lastName: Joi.string().max(22).required(),
        phone: Joi.number().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        password: Joi.string().min(7).required(),
        confirmPassword: Joi.string().min(7).required(),
    });

    return schema.validate(userInfo);
}

const validateUserLoginInfo = (userInfo) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(7).required(),
    });

    return schema.validate(userInfo);
}

const validateDepositInfo = (userInfo) => {

    const schema = Joi.object({

        email: Joi.string().email().required(),
        amount: Joi.number().precision(2).required(),
        
    });

    return schema.validate(userInfo);
}

module.exports = {

    validateUserInfo,
    validateUserLoginInfo,
    validateDepositInfo
};