var path = require('path');


exports.run = function(bots, commands, message, args) {
  bots.js.joinVoiceChannel(message.author.voiceChannel, (err, connection) => {
    if (err) {
        bots.js.sendMessage(message.channel, err);
        return;
    }
    bots.js.sendMessage(message.channel, "hello!");
    setTimeout(function () {
      connection.playFile('../media/audio/toni.mp3', () => {
        bots.js.sendMessage(message.channel, "bye.");
        bots.js.leaveVoiceChannel(connection.voiceChannel);
      });
    }, 2000);
  });
};
