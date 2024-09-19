const express = require('express');
const { Accounts, Users } = require('../Database.js');
const { transferSchema } = require('../zodSchemas.js');
const { authMiddleware } = require('../middlewares/userMiddleware');
const mongoose = require('mongoose');

const accountRouter = express();

accountRouter.get('/balance', authMiddleware, async (req, res) => {

    try {
        const account = await Accounts.findOne({
            userId: req.userId,
        })

        const balance = account.balance;
    
        res.status(200).json({
            balance: balance,
        });

    } catch (err) {
        console.log(err);

        return res.status(400).json({
            msg: "Unable to get balance",
        });
    }
});

accountRouter.put('/transfer', authMiddleware, async (req, res) => {

    try {
        const session = await mongoose.startSession();

        session.startTransaction();
        let { to, amount } = req.body;
        amount = parseInt(amount);
        const parseResponse = transferSchema.safeParse({to: to, amount: amount});

        if (!parseResponse.success) {
            console.log(parseResponse.error);
            res.status(400).json({
                msg: "Unable to parse transfer info"
            });
            return;
        }

        const account = await Accounts.findOne({ userId: req.userId }).session();

        if(!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                msg: "Unable to find sender / Insufficient Balance"
            });
        }

        const toUser = await Users.findOne({ username: to }).session();

        const toAccount = await Accounts.findOne({ userId: toUser._id }).session();

        if(!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                msg: "Receiver Account not found"
            });
        }

        await Accounts.updateOne({ userId: req.userId }, { $inc: { balance : -amount}}).session();
        await Accounts.updateOne({ userId: toAccount.userId }, { $inc: { balance : amount}}).session();

        await session.commitTransaction();
        await session.endSession();

        res.status(200).json({
            msg: "Transfer Successful!",
        });
    
    } catch (err) {
        console.log(err);
        
        return res.status(400).json({
            msg: "Error occured in transaction",
        })
    }
}); 

module.exports = accountRouter;