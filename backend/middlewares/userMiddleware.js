const { userDataSchema } = require('../zodSchemas.js');
const { Users, Accounts } = require('../Database.js');
const { JWT_SECRET } = require('../config.js');
const jwt = require('jsonwebtoken');

async function userSignupMiddleware(req, res, next) {
    const userPayload = req.body;
    const parseResponse = userDataSchema.safeParse(userPayload);

    if (!parseResponse.success) {
        console.log(parseResponse.error);
        res.status(400).json({
            msg: 'Please fill valid information',
        })

    } else {
        const User = await Users.findOne({
            username: userPayload.username
        })

        if(User) {
            res.status(400).json({
                msg: 'User already exists'
            });

        } else {
            next();
        }
    }

    return;
}

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(411).json({
            msg: "Could'nt find authorization header",
        })
        return;
    }

    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        
        if(decodedToken.userId) {
            req.userId = decodedToken.userId;
            next();

        } else {
            res.status(411).json({
                msg: "Problem in authorization header",
            });
            return;
        }

    } catch (err) {
        console.log('Error', err);
    }
    
}

module.exports = {
    userSignupMiddleware,
    authMiddleware
}