var dutil = require('../lib/discord.utilities.js');
var settings = require('../settings.json');
var parseArgs = require('minimist');

exports.run = function(bots, commands, message, args) {
  if (!args) {
    bots.js.reply(message, help(settings.prefix));
    return;
  }

  var _args = parseArgs(args.split(' '));

  if (_args._.length < 2) {
    bots.js.reply(message, help(settings.prefix));
    return;
  }

  var channel = _args._[1];
  channel = channel.indexOf('#') !== 0 ? `#${channel}` : channel;
  var twitch = bots.twitch;

  switch (_args._[0]) {
    case 'say':
      if (_args._.length < 3) {
        bots.js.reply(message, help(settings.prefix));
        return;
      }
      var msg =  _args._.splice(2).join(' ');
      if (msg.indexOf('/') === 0) {
        bots.js.reply(message, 'Don\'t you try to execute commands from here!');
        return;
      }
      twitch.say(channel, `<${message.author.username}> ${msg}`).then(function(data) {
        bots.js.reply(message, `Successfully sent chat message \`${msg}\` to \`${channel}\` :ok_hand:`);
        console.log(`Successfully sent chat message '${msg}' to '${channel}'.`);
      }).catch(function(err) {
        bots.js.reply(message, `:warning: Failed to send chat message \`${msg}\` to \`${channel}\`\n\`\`\`${err.message}\`\`\``);
        console.log(`Failed to send chat message '${msg}' to '${channel}'\n${err.stack}`);
      });
      break;
    case 'ban':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'unban':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'clearchat':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'join':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'leave':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'mod':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'unmod':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'slow':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'submode':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    case 'timeout':
      bots.js.reply(message, `\`${_args._[0]}\` is not implemented yet.`);
      break;
    default:
      bots.js.reply(message, help(settings.prefix));
  }
};

function isMod(message, channel) {

}

function help(prefix) {
  return `\`\`\`Usage:
  ${prefix}twitch <command> <channel>

Commands:
  say <message>, *ban <user>, *unban <user>, *clearchat, *join, *leave,
  *mod <user>, *unmod <user>, *slow <on|off>, *submode <on|off>, *timeout <user>

*: not implemented yet
\`\`\``;
}

exports.help = help;
