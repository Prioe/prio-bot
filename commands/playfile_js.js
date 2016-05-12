var queue = [];
var playing = false;
var conn = null;

function play(bots, message, file) {
  var channel = message.author.voiceChannel;
  var currentChannel = bots.js.user.voiceChannel;

  if (file)
    queue.push(file);

  if (channel != currentChannel) {
    bots.js.joinVoiceChannel(message.author.voiceChannel, (err, connection) => {
      if (err) throw err;
      start(bots, message, connection);
    });
  } else {
    start(bots, message, conn);
  }

}

function start(bots, message, connection) {
  if (playing) return;
  play_i(connection, queue.shift(), next);
  function next(e) {
    if (e) {
      bots.js.sendMessage(message.channel, `\`\`\`${e.stack}\`\`\``);
    }
    if (queue.length > 0) {
      play_i(connection, queue.shift(), next);
    } else {
      connection.stopPlaying();
      bots.js.leaveVoiceChannel(bots.js.user.voiceChannel, err => {
        if (err) throw err;
      });
    }
  }
}

function play_i(connection, file, callback) {
  playing = true;
  try {
    connection.playFile(file, (err, intent) => { //http://www.noiseaddicts.com/samples_1w72b820/3740.mp3
      if (err) throw err;
      intent.on('error',  err => {
        throw err;
      });
      intent.on('end',  () => {
        playing = false;
        callback(null);
      });
    });
  } catch (e) {
    playing = false;
    callback(e);
  }


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
