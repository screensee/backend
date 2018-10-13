const router = require('express').Router();
const resCreator = require('../utils/resCreator');
const Room = require('../models/room');
const User = require('../models/user');


function getRoomResponse(room) {
  return {
    id: room.id,
    participants: room.participants,
    videoLink: room.videoLink,
    pseudonym: room.pseudonym,
  };
}

router.get('/id/:roomId', function (req, res) {
  const { roomId } = req.params;
  if (roomId) {
    Room.findByRoomId(roomId, (error, room) => {
      if (error) {
        throw error;
      }
      if (room) {
        res.json(resCreator.success(getRoomResponse(room)));
      } else {
        res.status(404).json(resCreator.error(`Could not find the room with id: ${roomId}`));
      }
    });
  } else {
    res.status(400).json(resCreator.error('Room ID was not provided'));
  }
});

router.get('/:pseudonym', (req, res) => {
  const { pseudonym } = req.params;
  if (pseudonym) {
    Room.findByPseudonym(pseudonym, (error, room) => {
      if (error) {
        throw error;
      }
      if (room) {
        res.json(resCreator.success(getRoomResponse(room)));
      } else {
        res.status(404).json(resCreator.error(`Could not find the room with pseudonym: ${pseudonym}`));
      }
    });
  } else {
    res.status(400).json(resCreator.error('Pseudonym was not provided'));
  }
});

router.post('/create', (req, res) => {
  process.nextTick(function () {
    const { pseudonym } = req.body;
    if (pseudonym) {
      Room.findByPseudonym(pseudonym, (error, room) => {
        if (error) {
          throw error;
        }
        if (room) {
          res.status(409).json(resCreator.error(`Room with pseudonym ${pseudonym} already exists`));
        } else {
          createRoom(req, res);
        }
      });
    } else {
      // pseudonym not provided
      createRoom(req, res);
    }
  });
});

function createRoom(request, response) {
  const { password, videoLink, pseudonym } = request.body;
  const { user } = request;
  const newRoom = new Room();
  newRoom.id = Math.random().toString().replace('0.', '');
  newRoom.videoLink = videoLink || '';
  newRoom.pseudonym = pseudonym || '';

  // TODO: add user that create this
  newRoom.participants = [user.name];

  if (password) {
    newRoom.password = password;
  }
  newRoom.save((err) => {
    if (err) {
      throw err;
    }
    response.json(resCreator.success(getRoomResponse(newRoom)));
  });
}

router.post('/join/:roomId', (req, res) => {
  addOrRemoveUser(true, req, res);
});

router.post('/exit/:roomId', (req, res) => {
  addOrRemoveUser(false, req, res);
});

function addOrRemoveUser(isJoin, req, res) {
  const { roomId } = req.params;
  Room.findByRoomId(roomId, (error, room) => {
    if (error) {
      throw error;
    }
    if (room) {
      const func = isJoin ? room.addParticipant : room.removeParticipant;
      func.call(room, req.user.name, (err, room) => {
        if (err) {
          throw err;
        }
        res.json(resCreator.success(getRoomResponse(room)));
      });
    } else {
      res.status(404).json(resCreator.error(`Could not find the room with id: ${roomId}`));
    }
  });
}


module.exports = router;
