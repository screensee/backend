module.exports = cb => (err, ...rest) => {
  if (err) {
    throw err;
  }
  cb(err, ...rest);
};
