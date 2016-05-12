var path = require('path');
var play = require('./playfile.js');

exports.run = function(bots, commands, message, args) {
  if (args === '1') {
    bots.js.joinVoiceChannel(message.author.voiceChannel, (err, connection) => {
      if (err) {
          bots.js.sendMessage(message.channel, err);
          return;
      }
      bots.js.sendMessage(message.channel, "hello!");
      connection.playFile(path.join(__dirname, '../media/audio/toni.mp3'), (err, intent) => { //http://www.noiseaddicts.com/samples_1w72b820/3740.mp3
        if (err) {
            bots.js.sendMessage(message.channel, '1: ' + err);
            return;
        }
        intent.on('error',  err => {
          bots.js.sendMessage(message.channel, '2: ' + err);
        });
        intent.on('end',  () => {
          bots.js.sendMessage(message.channel, "bye.");
          bots.js.leaveVoiceChannel(connection.voiceChannel, err => {
            console.log(err);
          });
        });
      });
    });
  } else if (args == "2") {
    play.play(bots, message, path.join(__dirname, '../media/audio/toni.mp3'));
  }

};

//alright! joining the voice channel and playing the file is working perfectly, but i can't get the bot to leave the voice channel afterwards

//bot.joinVoiceChannel(message.author.voiceChannel, (err, connection) => {
//  if (err) {
//    console.error(err);
//    return;
//  }
//  bot.sendMessage(message.channel, "hello!");
//  connection.playFile('../media/audio/sound.mp3', () => {
//    bot.sendMessage(message.channel, "bye.");
//    bot.leaveVoiceChannel(connection.voiceChannel);
//  });
//});
//
//
//Hello guys! I've been trying for quite a while now to get voice working wih d.js, but i can't manage to do it.
//I did everything as '?ahh novoice' suggested, I'm running node v4.3.2, python v2.7.10 and the latest d.js and node-opus.
//Sound playback does work with discord.io, I tried the same code on a windows and a linux machine, both same behaviour.
//The bot joins my voice channel, no sound is playing, the 'bye.' message shows up and the bot stays in the channel.
//I'd really appreciate if you guys could tell me if there's anything wrong with my code:
//http://puu.sh/oPwPR/ac2df826ad.png
