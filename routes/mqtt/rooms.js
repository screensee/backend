module.exports = (server) => {
  // const MESSAGE = /\/room\/\d+\/message\//;


  // server.on('published', function (packet, client) {

  // });

  // server.on('message', function (topic, message) {
  //   // message is Buffer
  //   console.log(message.toString());
  //   // client.end();
  // });

  function onMessage(roomId, message) {
    server.publish({
      topic: `room/${roomId}/message`,
      payload: JSON.stringify(message),
    });
  }


  return {
    onMessage,
  };
};
