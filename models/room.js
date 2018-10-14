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

roomSchema.methods.addParticipant = function (name, cb) {
  if (this.participants.includes(name)) {
    cb(null, this);
  } else {
    this.participants = [
      ...this.participants,
      name,
    ];
    this.save(cb);
  }
};

roomSchema.methods.removeParticipant = function (name, cb) {
  this.participants = this.participants.filter(elem => elem !== name);
  this.save(cb);
};

roomSchema.methods.update = function (data, cb) {
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      this[key] = data[key];
    }
  });
  this.save(cb);
};

roomSchema.statics.findByRoomId = function (id, cb) {
  this.findOne({ id }, cb);
};

roomSchema.statics.findByPseudonym = function (pseudonym, cb) {
  this.findOne({ pseudonym }, cb);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('Room', roomSchema);
