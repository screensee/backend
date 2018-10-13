const mqtt = require('mqtt');
const debug = require('debug');
const mainRoutes = require('../routes/mqtt/main');

module.exports = () => {
  // init when local mqtt broker has already upped

  const client = mqtt.connect(`mqtt://localhost:${process.env.MQTT_SOCKET_PORT || 1883}`);

  client.on('connect', function () {
    debug('mqtt client connect');
    mainRoutes(client);
  });

  client.on('message', function (topic, message) {

  });
};
