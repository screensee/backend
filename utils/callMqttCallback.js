module.exports = (callback, ...rest) => {
  if (typeof callback === 'function') {
    callback(...rest);
  }
};
