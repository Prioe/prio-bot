var play = require('./playfile.js');
var path = require('path');

exports.run = function(bots, commands, message, args) {
  play.play(bots, message, path.join(__dirname, '../media/audio/toni.mp3'));
};
