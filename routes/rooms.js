const router = require('express').Router();
const Room = require('../models/room');

router.get('/:roomId', function(req, res) {
  const roomId = req.params.roomId;
  let isFound = false;
  if (roomId) {
    Room.findById(roomId, (error, room) => {
      if (!error && room) {
        res.json({
          participants: room.participants
        });
      }
    });
  } else {
    res.status(400).send('Room ID was not provided');
  }
  if (!isFound) {
    res.status(404).send(`Could not find the room with id: ${roomId}`);
  }
});

router.post('/create', (req, res) => {
  const id = req.params.id;
  process.nextTick(function() {
    Room.findById(id, (error, room) => {
      if (!room) {
        const newRoom = new Room();
        newRoom.id = Math.round(Math.random() * 1000000).toString();
        newRoom.participants = [req.body.master];
        if (req.body.password) {
          newRoom.password = req.body.password;
        }
        newRoom.save((error) =>{
          if (error) {
            throw error;
          }
          res.json(newRoom);
        });
      } else {
      }
    });
  });
});

module.exports = router;
