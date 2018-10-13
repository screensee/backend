const mongoose = require('mongoose');

// define the schema for our user model
const roomSchema = mongoose.Schema({
  id: String,
  participants: [String],
  password: { type: String, default: '' }
});

// checking if password is valid
roomSchema.methods.validPassword = function(password, cb) {
  let result = false;
  if (this.password) {
    result = password === this.password;
  } else {
    result = true;
  }
  return result;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Room', roomSchema);
