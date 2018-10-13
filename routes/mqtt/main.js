module.exports = (client) => {
  client.subscribe('presence', function (err) {
    if (!err) {
      // client.publish('presence', 'Hello mqtt');
      // client.publish('presence', 'Hello mqtt');
    }
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    // client.end();
  });
};
