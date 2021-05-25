const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/register', async (req, res) => {
    // Validate user data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exist
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('This email is already used!');

    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });
    try {
        const savedUser = await user.save();
        // return token
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        const data = {
            token: token,
            user: {
                name: savedUser.name,
                email: savedUser.email
            }
        }
        res.header('auth-token', token).send(data);
    }
    catch(error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    // Validate user data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exist
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('This email doesn\'t exist in our database!');

    // Check password
    const isValid = bcrypt.compareSync(req.body.password, user.password);
    if(!isValid) return res.status(400).send('Password isn\'t valid!');

    // return data
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    const data = {
        token: token,
        user: {
            name: user.name,
            email: user.email
        }
    }
    res.header('auth-token', token).send(data);
});

router.get('/', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user._id});

    const info = {
        name: user.name,
        email: user.email
    }
    res.send(info);
});

module.exports = router;