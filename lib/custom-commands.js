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
			var fun = null;
			switch (cmd.content.type) {
				case 'single':
					fun = (bots, commands, message, args) => {
						//play.play(
					}
					break;
			}
      o = {
        fun: (bots, commands, message, args) => {
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
