const router = require('express').Router();

module.exports = (passport) => {
  /* GET users listing. */
  router.get('/', (req, res) => {
    res.send('respond with a resource');
  });

  router.post('/login', passport.authenticate('local-login'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user);
  });

  router.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user);
  });

  return router;
};
