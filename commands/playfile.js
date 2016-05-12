var queue = [];
var playing = false;

function play(bots, message, file) {
  var channelID = message.author.voiceChannel.id;
  var io_bot_voice_id = bots.io._bot.servers[message.channel.server.id].members[bots.io._bot.id].voice_channel_id;

  if (file)
    queue.push(file);

  if (channelID != io_bot_voice_id) {
    bots.io._bot.joinVoiceChannel(channelID, () => {
      start(bots, channelID);
    });
  } else {
    setTimeout(function () {
      start(bots, channelID);
    }, 300);
  }

}

function start(bots, channelID) {
  if (playing) return;
  play_i(bots, channelID, queue.shift(), next);
  function next() {
      if (queue.length > 0) {
        play_i(bots, channelID, queue.shift(), next);
      } else {
        bots.io._bot.leaveVoiceChannel(channelID);
      }
  }
}

function play_i(bots, channelID, file, callback) {
  playing = true;
  bots.io._bot.getAudioContext( { channel: channelID, stereo: true }, (stream) => {
    stream.playAudioFile(file);
    stream.once('fileEnd', () => {
      playing = false;
      callback();
    });
  });

}

exports.run = function(bots, commands, message, args) {
  play(bots, message, args);
};

exports.play = play;

exports.help = function (prefix) {
  return `\`\`\`${prefix}playfile <FILE>
    play a file (http-hosted or local) in your voice channel
    //TODO: play file from attachement\`\`\``;
};
