var queue = [];
var playing = false;

function play(bots, message, file) {
  if (!file) {
    bots.js.sendMessage(message.channel, help(''));
    return;
  }
  var channel = message.author.voiceChannel;
  if (!channel) {
    bots.js.sendMessage(message.channel, 'You have to be in a voice channel to use audio commands!');
    return;
  }
  queue.push({ target: channel, file: file});

  if (playing) return;
  playQueue(bots.js);

}

function playQueue(bot) {
  playing = true;
  var currentChannel = bot.user.voiceChannel;
  next();

  function next() {
    if (queue.length <= 0) {
      bot.leaveVoiceChannel(currentChannel).catch(function (e) {
        playing = false;
        console.log('something bad happened while leaving the voice channel:\n' + e.stack);
      }).then(function () {
        playing = false;
        console.log(`left voice channel '${currentChannel}'`);
      });
      return;
    }
    var currentFile = queue.shift();
    if (currentChannel !== null && currentChannel === currentFile.target) {
      //were already in the right channel, just play the file
      playInCurrentChannel(bot, currentFile, next);
    } else if (currentChannel !== null && currentChannel != currentFile.target) {
      //were in a channel, but the wrong one. leave this channel and join the right one, then play the file
      bot.leaveVoiceChannel(bot.user.voiceChannel).catch(function (e) {
        throw e;
      }).then(function () {
        console.log(`left voice channel '${currentChannel}'`);
        currentChannel = null;
        bot.joinVoiceChannel(currentFile.target).catch(function (e) {
          throw e;
        }).then(function (connection) {
          currentChannel = bot.user.voiceChannel;
          console.log(`joined voice channel '${currentChannel}'`);
          playInCurrentChannel(bot, currentFile, next);
        });
      });


    } else if (currentChannel === null) {
      //were in no channel, just join the right one and play the file
      bot.joinVoiceChannel(currentFile.target).catch(function (e) {
        throw e;
      }).then(function (connection) {
        currentChannel = bot.user.voiceChannel;
        console.log(`joined voice channel '${currentChannel}'`);
        playInCurrentChannel(bot, currentFile, next);
      });
    } else {
      //something really unexpected and bad happened :/. the target channel is null
      bot.sendMessage(message.channel,
`\`\`\`
this should never happen! :(
  target: ${channel}
  current: ${currentChannel}
  queue: ${queue}
\`\`\``
      );
    }
  }

}

function playInCurrentChannel(bot, file, callback) {
  console.log(`playing '${file.file}'`);
  bot.voiceConnection.playFile(file.file, (err, intent) => { //http://www.noiseaddicts.com/samples_1w72b820/3740.mp3
    if (err) throw err;
    intent.on('error',  err => {
      throw err;
    });
    intent.on('end',  () => {
      playing = false;
      callback();
    });
  });
}

function help(prefix) {
  return `\`\`\`${prefix}playfile <FILE>
    play a file (http-hosted or local) in your voice channel
    //TODO: play file from attachement\`\`\``;
}

exports.run = function(bots, commands, message, args) {
  play(bots, message, args);
};

exports.play = play;
exports.help = help;
