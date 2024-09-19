const express = require('express');
const userRouter = require('./userRouter.js');
const accountRouter = require('./accountRouter.js');

const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/account', accountRouter);

module.exports = mainRouter;
