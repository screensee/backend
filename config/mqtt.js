// module.exports = { url: 'mqtt://test.mosquitto.org' };

var mosca = require('mosca');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  interfaces: [
    { type: "mqtt", port: process.env.MQTT_SOCKET_PORT || 1883 },
    { type: "http", port: process.env.MQTT_HTTP_PORT || 1884, bundle: true },
  ],
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function (client) {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function (packet, client) {
  if (packet.topic.indexOf('$SYS') === -1) {
    console.log('Published', packet.payload);
  }
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}




var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('presence/123/123', function (err) {
    if (!err) {
      client.publish('presence/123/123', 'Hello mqtt from server')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  if (message.toString() === 'Hello mqtt!!!') {
    setTimeout(() => {
      client.publish('presence/123/123', '123')
    }, 5000);
  }
  // client.end()
})