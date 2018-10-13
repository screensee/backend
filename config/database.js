module.exports = {
  url: process.env.MONGODB_URI ? `${process.env.MONGODB_URI}/hackathon` : 'mongodb://localhost:27017/hackathon',
};
