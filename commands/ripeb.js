var play = require('../commands/playfile.js');
var path = require('path');
var lastplayed = 0;
const COOLDOWN = 5;
var settings = require('../settings.json');
var dutil = require('../lib/discord.utilities.js');

exports.run = function(bots, commands, message, args) {
  var currentTime = new Date().getTime();
  if ((lastplayed && lastplayed > currentTime) && !dutil.isSudo(message)) {
    bots.js.reply(message, `NOCH ${Math.floor((lastplayed - currentTime) / (60 *1000))} MINUTEN COOLDOWN :ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand:`);
    return;
  }
  play.play(bots, message, path.join(__dirname, '../media/audio/breakeb.mp3'));
  lastplayed = currentTime + COOLDOWN*60*1000;
};
