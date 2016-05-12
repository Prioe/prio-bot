var path = require('path');


exports.run = function(bots, commands, message, args) {
  bots.js.sendMessage(message.channel, 'listening...');
  commands.listen(_message => {
    try {
      bots.js.sendMessage(_message.channel, `got (${_message.content}), listening ...`);
      if (_message.content.startsWith('joinme')) {
        bots.js.sendMessage(_message.channel, 'joining ' + _message.author.voiceChannel);
        bots.js.joinVoiceChannel(_message.author.voiceChannel.id).then(connection => {
          connection.playFile('toni.mp3', {volume: "1"});
        }).catch(onError);
        return;
      }
      if (_message.content.startsWith('leave')) {
        bots.js.sendMessage(_message.channel, 'leaving voiceChannel');
        bots.js.internal.leaveVoiceChannel();
        return;
      }
      if (_message.content.startsWith('toni')) {
        console.log(bots.io._bot.joinVoiceChannel);
        bots.io._bot.joinVoiceChannel("153987685722226689", () => {
          bots.io._bot.getAudioContext( { channel: "153987685722226689", stereo: true }, (stream) => {
            stream.playAudioFile('http://www.noiseaddicts.com/samples_1w72b820/280.mp3');//path.join(__dirname, '../media/audio/toni.mp3'));
            stream.once('fileEnd', () => {
              bots.io._bot.leaveVoiceChannel("153987685722226689");
            });
          });
        });
        return;
      }


    } catch (error) {
      onError(error);
    }
    function onError(err) {
      bots.js.reply(_message, err.stack);
    }
  });


};
