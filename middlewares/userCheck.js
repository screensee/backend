const User = require('../models/user');
const Room = require('../models/room');
const resCreator = require('../utils/resCreator');
const errCheck = require('../utils/errCheck');

exports.auth = (req, res, next) => {
  const { user: userCookie } = req.cookies;
  if (userCookie) {
    User.findByHash(userCookie, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        req.user = {
          name: user.name,
          hash: user.hash,
        };
        next();
      } else {
        res.status(401).json(resCreator.error('Could not find your user data in DB'));
      }
    });
  } else {
    res.status(401).json(resCreator.error('You must be authorized'));
  }
};

exports.isInRoom = (req, res, next) => {
  const { user: { name } } = req;
  let roomId = '';
  if (req.body.roomId) {
    roomId = req.body.roomId; // eslint-disable-line
  } else if (req.params.roomId) {
    roomId = req.params.roomId; // eslint-disable-line
  }

  Room.findByRoomId(roomId, errCheck((err, room) => {
    if (room) {
      if (room.participants.includes(name)) {
        next();
      } else {
        res.status(403).json(resCreator.error(`User ${name} does not consist in the room ${roomId}`));
      }
    } else {
      res.status(404).json(resCreator.error(`Could not find room ${roomId}`));
    }
  }));

};
