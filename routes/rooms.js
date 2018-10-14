const router = require('express').Router();
const generateName = require('sillyname');
const resCreator = require('../utils/resCreator');
const errCheck = require('../utils/errCheck');
const Room = require('../models/room');
const MessageStore = require('../models/messageStore');

function createRoomResponse(room) {
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
        res.json(resCreator.success({
          ...createRoomResponse(room),
          isMaster: room.participants[0] === req.user.name,
        }));
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
        res.json(resCreator.success({
          ...createRoomResponse(room),
          isMaster: room.participants[0] === req.user.name,

        }));
      } else {
        res.status(404).json(resCreator.error(`Could not find the room with pseudonym: ${pseudonym}`));
      }
    });
  } else {
    res.status(400).json(resCreator.error('Pseudonym was not provided'));
  }
});

router.post('/update', (req, res) => {
  const {
    password, videoLink, pseudonym, roomId,
  } = req.body;
  Room.findByRoomId(roomId, errCheck((err, room) => {
    if (room) {
      room.update({
        password,
        videoLink,
        pseudonym,
      }, errCheck((err, updatedRoom) => {
        res.json(resCreator.success({
          ...createRoomResponse(updatedRoom),
          isMaster: room.participants[0] === req.user.name,

        }));
      }));
    } else {
      res.status(404).json(resCreator(`Could not find room with id: ${roomId}`));
    }
  }));
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

  function createRoom(request, response) {
    const { password, videoLink, pseudonym } = request.body;
    const { user } = request;
    const newRoom = new Room();
    newRoom.id = Math.random().toString().replace('0.', '');
    newRoom.videoLink = videoLink || '';
    newRoom.pseudonym = pseudonym || generateName().split(' ')[0].toLowerCase();
    newRoom.participants = [user.name];

    if (password) {
      newRoom.password = password;
    }
    newRoom.save((err) => {
      if (err) {
        throw err;
      }
      const newMessageStore = new MessageStore();
      newMessageStore.roomId = newRoom.id;
      newMessageStore.save();
      response.json(resCreator.success({
        ...createRoomResponse(newRoom),
        isMaster: true,
      }));
    });
  }
});

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
      exec(room);
    } else {
      Room.findByPseudonym(roomId, (error, room) => {
        if (error) {
          throw error;
        }
        if (room) {
          exec(room);
        } else {
          res.status(404).json(resCreator.error(`Could not find the room with id: ${roomId}`));
        }
      });
    }
  });

  function exec(room) {
    const func = isJoin ? room.addParticipant : room.removeParticipant;
    func.call(room, req.user.name, (err, room) => {
      if (err) {
        throw err;
      }
      res.json(resCreator.success({
        ...createRoomResponse(room),
        isMaster: room.participants[0] === req.user.name,
      }));
    });
  }
}


module.exports = router;
