const router = require('express').Router();
const md5 = require('md5');
const errCheck = require('../utils/errCheck');
const resCreator = require('../utils/resCreator');
const MessageStore = require('../models/messageStore');

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  MessageStore.findByRoomId(roomId, errCheck((err, store) => {
    if (store) {
      res.json(resCreator.success(store.messages));
    } else {
      res.status(404).json(resCreator.error(`Could not find messages for room ${roomId}`));
    }
  }));
});

router.post('/post', (req, res) => {
  const { user: { name }, body: { roomId, text } } = req;
  MessageStore.findByRoomId(roomId, errCheck((err, store) => {
    if (store) {
      const message = createMessage(text, name);
      store.addMessage(message, errCheck(() => {
        res.json(resCreator.success(message));
      }));
    } else {
      res.status(404).json(resCreator.error(`Could not find messages for room ${roomId}`));
    }
  }));
});

function createMessage(text, name) {
  return {
    id: md5(`${text.substr(0, 5)}${Math.random()}`),
    timestamp: new Date().getTime(),
    author: name,
    text,
  };
}

module.exports = router;
