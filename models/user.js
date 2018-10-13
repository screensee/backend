// app/models/user.js
// load the things we need
const mongoose = require('mongoose');
// define the schema for our user model
const userSchema = mongoose.Schema({
  hash: String,
  name: String,
});

userSchema.statics.findByHash = function (hash, cb) {
  this.findOne({ hash }, cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
