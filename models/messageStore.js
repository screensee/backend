const mongoose = require('mongoose');
const errCheck = require('../utils/errCheck');
// define the schema for our user model
const messageStoreSchema = mongoose.Schema({
  roomId: String,
  messages: {
    type: [{
      text: String,
      timestamp: Number,
      author: String,
    }],
    default: [],
  },
});
messageStoreSchema.statics.findByRoomId = function (roomId, cb) {
  this.findOne({ roomId }, cb);
};

messageStoreSchema.methods.addMessage = function (message, cb) {
  this.messages.push(message);
  this.save(cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('MessageStore', messageStoreSchema);
