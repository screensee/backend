module.exports = {

  // 'url': 'your-settings-here' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  'url': process.env.MONGODB_URI || 'mongodb://test:test123@ds052978.mlab.com:52978/hackathon'
};