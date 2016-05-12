var play = require('../commands/playfile.js');
var path = require('path');

function custom_commands(json) {
  var cmds = [];
  for (var cmd in json) {
    if (!json.hasOwnProperty(cmd)) return;
    if (!json[cmd].approved)
      console.log(`  custom command '${cmd}' is not approved!`);
    cmds.push(parse(json[cmd], cmd));
  }
  return cmds;
}

function parse(cmd, name) {
  var o = {};
  switch (cmd.type) {
    case 'echo':
      o = {
        fun: (bots, commands, message, args) => {
          bots.js.sendMessage(message.channel, cmd.content);
        },
        command: name
      };
      break;
    case 'audio':
      o = {
        fun: (bots, commands, message, args) => {
          console.log(args);
          //play.play(bots, message, path.join(__dirname, '../media/audio/toni.mp3'));
        },
        command: name
      };
      break;
    default:
  }
  console.log(`  registered custom command '${name}'`);
  return o;
}

module.exports = custom_commands;
exports.parse = parse;
