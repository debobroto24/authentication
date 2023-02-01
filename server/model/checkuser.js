const mongoose = require('mongoose');

const Username = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        trim: true,
    }
});

const UsernameModel = mongoose.model('users', Username);

module.exports = UsernameModel;