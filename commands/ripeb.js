var play = require('../commands/playfile.js');
var path = require('path');
var lastplayed;
var COOLDOWN = 5;
var settings = require('../settings.json');

exports.run = function(bots, commands, message, args) {
  if ((lastplayed && lastplayed > new Date().getTime()) && !settings.sudo_role) {
    bots.js.reply(message, `NOCH ${Math.floor((lastplayed - new Date().getTime()) / (60 *1000))} MINUTEN COOLDOWN :ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand::ok_hand:`);
    return;
  }
  play.play(bots, message, path.join(__dirname, '../media/audio/breakeb.mp3'));
  lastplayed = new Date().getTime() + COOLDOWN*60*1000;
};
