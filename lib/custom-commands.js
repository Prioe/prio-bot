var play = require('../commands/playfile.js');
var path = require('path');

function custom_commands(json) {
  var cmds = [];
  for (var cmd in json) {
    if (!json.hasOwnProperty(cmd)) return;
    var command = parse(json[cmd], cmd);
    if (command) {
      cmds.push(command);
      console.log(`  registered custom command '${cmd}'`);
    } else
      console.error(`  custom command '${cmd}' failed to parse!`);
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
			var fun = null;
      if (cmd.content.random) {

      } else {
        fun = (bots, commands, message, args) => {
          for (var i = 0; i < cmd.content.files.length; i++) {
            play.play(bots, message, (cmd.content.files[i].remote ? cmd.content.files[i].file : path.join(__dirname, cmd.content.files[i].file)));
          }
        };
      }
      if (fun) {
        o = {
          fun: fun,
          command: name
        };
      } else {
        return null;
      }

      break;
    default:
  }
  return o;
}

module.exports = custom_commands;
exports.parse = parse;
