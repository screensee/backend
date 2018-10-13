const router = require('express').Router();
const resCreator = require('../utils/resCreator');
const Room = require('../models/room');

router.get('/:roomId', function (req, res) {
  const { roomId } = req.params;
  if (roomId) {
    Room.findByRoomId(roomId, (error, room) => {
      if (error) {
        throw error;
      }
      if (room) {
        res.json(resCreator.send({
          ...room,
        }));
      } else {
        res.status(404).send(resCreator.error(`Could not find the room with id: ${roomId}`));
      }
    });
  } else {
    res.status(400).json(resCreator.error('Room ID was not provided'));
  }
});

router.post('/create', (req, res) => {
  const { id } = req.params;
  process.nextTick(function () {
    Room.findByRoomId(id, (error, room) => {
      if (!room) {
        const { password, videoLink, pseudonym } = req.body;
        const newRoom = new Room();
        newRoom.id = Math.round(Math.random() * 1000000).toString();
        newRoom.videoLink = videoLink;
        newRoom.pseudonym = pseudonym;

        // TODO: add user that create this
        newRoom.participants = [];

        if (password) {
          newRoom.password = password;
        }
        newRoom.save((err) => {
          if (err) {
            throw err;
          }
          res.json(resCreator.success(newRoom));
        });
      } else {
        res.status(409).json(resCreator.error(`Room with ${id} is exists`));
      }
    });
  });
});

module.exports = router;
