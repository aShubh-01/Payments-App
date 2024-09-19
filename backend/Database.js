const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ashubh:ashubh010xDmongodb@cluster01.khe8kxx.mongodb.net/Transaction_App');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLenth: 1,
    },

    lastName: {
        type: String,
        required: true,
        minLenth: 1,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        minLenth: 1,
    },

    password:{
        type: String,
        required: true,
        unique: true,
        minLenth: 6,
    }
})

const Users = mongoose.model('Users', userSchema);

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },

    balance: {
        type: Number,
        require: true,
        min: 0
    }
})

const Accounts = mongoose.model('Accounts', accountSchema);

module.exports = {
    Users,
    Accounts
} 