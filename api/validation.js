const Joi = require('@hapi/joi');

// Register validation
const registerValidation = (data) => {
    const scheme = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).required()
    });

    return scheme.validate(data);
};

// Login validation
const loginValidation = (data) => {
    const scheme = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).required()
    });

    return scheme.validate(data);
};

// Add city validation
const addCityValidation = (data) => {
    const scheme = Joi.object({
        city: Joi.string().max(255).required()
    });

    return scheme.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.addCityValidation = addCityValidation;