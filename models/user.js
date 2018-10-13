// app/models/user.js
// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const userSchema = mongoose.Schema({
  email: String,
  password: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = (password, cb) => {
  bcrypt.genSalt(8, (error, salt) => {
    if (error) {
      cb(error);
    } else {
      bcrypt.hash(password, salt, null,  cb);
    }
  }) 
};

// checking if password is valid
userSchema.methods.validPassword = function (password, cb) {
  bcrypt.compare(password, this.password, cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
