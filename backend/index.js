const mainRouter = require('./routes/mainRouter.js');
const cors = require('cors');
const express = require('express');
const port = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', mainRouter);

app.listen(port, () => {
    console.log(port, " active");
})