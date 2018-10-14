const mosca = require('mosca');


module.exports = (onUpCallback) => {
  const ascoltatore = {
    // using ascoltatore
    type: 'mongo',
    url: process.env.MONGODB_URI ? `${process.env.MONGODB_URI}/mqtt` : 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {},
  };

  const settings = {
    interfaces: [
      { type: 'mqtt', port: Number(process.env.MQTT_SOCKET_PORT) || 1883 },
      { type: 'http', port: Number(process.env.MQTT_HTTP_PORT) || 1884, bundle: true },
    ],
    backend: ascoltatore,
  };

  const server = new mosca.Server(settings);

  server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
  });

  server.on('clientDisconnected', function (client) {
    console.log('client disconnected', client.id);
  });

  // fired when a message is received
  server.on('published', function (packet, client) {
    if (packet.topic.indexOf('$SYS') === -1) {
      console.log('Published', packet.topic, packet.payload);
      // server.publish(packet);
    }
  });

  server.on('ready', setup);

  // fired when the mqtt server is ready
  function setup() {
    console.log('Mosca server is up and running');
    onUpCallback(server);
  }
};
