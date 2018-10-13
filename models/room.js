const mongoose = require('mongoose');

// define the schema for our user model
const roomSchema = mongoose.Schema({
  id: String,
  participants: [String],
  password: { type: String, default: '' },
  videoLink: { type: String, default: '' },
  pseudonym: { type: String, default: '' },
});

// checking if password is valid
roomSchema.methods.validPassword = function (password) {
  let result = true;
  if (this.password) {
    result = password === this.password;
  }
  return result;
};

roomSchema.statics.findByRoomId = function (id, cb) {
  this.findOne({ id }, (err, room) => {
    cb(err, room);
  });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Room', roomSchema);
