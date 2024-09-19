const { Users, Accounts } = require('../Database.js');
const { JWT_SECRET } = require('../config.js'); 
const { userDataSchema, updateUserDataSchema } = require('../zodSchemas.js');
const { userSignupMiddleware, authMiddleware } = require('../middlewares/userMiddleware.js');
const jwt = require('jsonwebtoken');
const express = require('express');

const userRouter = express.Router();

userRouter.post('/signup', userSignupMiddleware, async (req, res) => {

    try {
        const { username, firstName, lastName, password } = req.body;
        const user = await Users.create({
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password
    
        }).catch((err) => {
            console.log(err);
            res.status(400).json({
                msg: 'Please enter unique username/password'
            })
        });
    
        await Accounts.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000
        });
    
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);
    
        res.status(200).json({
            msg: "Account Created!",
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(400).json('Error occured while signing up user');
    }
});

userRouter.post('/signin', async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await Users.findOne({
            username: username,
            password: password
        });

        if(user) {
            const token = jwt.sign({
                userId: user._id,
            }, JWT_SECRET);

            res.status(200).json({
                msg: "Signed In Successfully!",
                token: token
            });
    
        } else {
            res.status(400).json({
                msg: "Could'nt find User"
            })
            return;
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: "Error while signing in"
        })
    }
});

userRouter.put('/user', authMiddleware, async (req, res) => {
    const updatedUserPayload = req.body;

    const parseResponse = updateUserDataSchema.safeParse(updatedUserPayload);

    if(!parseResponse.success) {
        console.log(parseResponse.error);
        res.status(400).json({
            msg: "Unable to parse data",
        })
        return;
    }

    try {
        Users.updateOne({
            _id: req.userId,
        }, {
            firstName: updatedUserPayload.firstName,
            lastName: updatedUserPayload.lastName,
            password: updatedUserPayload.password
        
        }).then(() => {
            res.status(200).json({
                msg: 'User Data Updated Successfully!',
            })
        });

    } catch (err) {
        console.log('Error ', err);
        res.json({
            msg: 'Unable to update data',
        });
        return;

    }
});

userRouter.get('/bulk', async (req, res) => {
    const keyword = (req.query.filter || "").trim();
    const selfUsername = req.headers.username;

    try {
        const allUsers = await Users.find({
            $or : [
                { firstName: {"$regex" : keyword} },
                { lastName: {"$regex" : keyword} }
            ]
       });
    
       const users = [];
    
       allUsers.forEach((user) => {
        if(user.username == selfUsername) return
        users.push({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        });
       })
    
       res.status(200).json({
        users: users
       });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: "Couldn't get users"
        })
    }
});

module.exports = userRouter;