const User = require('../models/user');
const resCreator = require('../utils/resCreator');

module.exports = (req, res, next) => {
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
