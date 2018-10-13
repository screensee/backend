
module.exports = {
  success: data => ({ result: 'ok', data }),
  error: error => ({ result: 'error', data: error }),
};
