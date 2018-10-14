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

  function onUserJoin(roomId, user) {
    server.publish({
      topic: `room/${roomId}/userJoin`,
      payload: user,
    });
  }

  function onUserExit(roomId, user) {
    server.publish({
      topic: `room/${roomId}/userExit`,
      payload: user,
    });
  }


  return {
    onMessage,
    onUserJoin,
    onUserExit,
  };
};
