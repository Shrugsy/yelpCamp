const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: 'https://static.thenounproject.com/png/883917-200.png'},
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false}
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

