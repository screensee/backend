const mongoose = require('mongoose');
// define the schema for our user model
const messageStoreSchema = mongoose.Schema({
  roomId: String,
  messages: {
    type: [{
      id: String,
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
