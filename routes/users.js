const router = require('express').Router();
const generateName = require('sillyname');
const md5 = require('md5');
const resCreator = require('../utils/resCreator');
const User = require('../models/user');


router.get('/init', (req, res) => {
  const { user: userCookie } = req.cookies;
  if (userCookie) {
    User.findByHash(userCookie, (err, userFromDB) => {
      if (err) {
        throw err;
      }
      if (!userFromDB) {
        createUser(generateName(), (user) => {
          sendUser(res, user);
        });
      } else {
        sendUser(res, userFromDB);
      }
    });
  } else {
    createUser(generateName(), (user) => {
      sendUser(res, user);
    });
  }

  function createUser(name, cb) {
    const hash = md5(name);

    const newUser = new User();
    newUser.name = name;
    newUser.hash = hash;
    newUser.save((err) => {
      if (err) {
        throw err;
      }
      cb(newUser);
    });
  }

  function sendUser(response, user) {
    response.cookie('user', user.hash, { maxAge: 900000, httpOnly: true });
    response.json(resCreator.success(user.name));
  }
});

module.exports = router;
