var dutil = require('../lib/discord.utilities.js');
var settings = require('../settings.json');
var parseArgs = require('minimist');
var dutil = require('../lib/discord.utilities.js');
var fs = require('fs-extra');

var regions = ['us-west', 'us-east', 'us-south', 'us-central', 'singapore', 'london', 'sydney', 'frankfurt', 'amsterdam'];

exports.run = function(bots, commands, message, args) {
  var bot = bots.js;
  if (!dutil.isSudo(message)){
    bot.sendMessage(message.channel, `:warning: You're not allowed to use that command! You need the role '${settings.sudo_role}' to run this command.`);
    return;
  }

  if (!args) {
    bots.js.sendMessage(message.channel, help(settings.prefix));
    return;
  }

  var _args = parseArgs(args.split(' '));

  switch (_args._[0]) {
    case 'icon':
      if (message.attachments.length === 0) {
        bots.js.reply(message,
          `:warning: There must be an attachement in the message! Either drag a file into discord and add the command as a comment or click the button left to the chat box and select a file! :warning:`);
        return;
      } else if (message.attachments.length > 1) {
        bots.js.reply(message, `:warning: Only the first attachement will be used.`);
      }
      bots.js.sendMessage(message.channel, 'Uploading to the local file system ...', (err, dl_message) => {

      });
      var attachement = message.attachments[0];
      dutil.downloadFileToBuffer(attachement.url, (dl_err, buffer) => {
        var s;
        if (dl_err)
          s = `Failed to upload the file:\n\`\`\`${dl_err.message}\`\`\``;
        else
          s = `Successfully uploaded the file. Setting it as the Server icon ...`;
        //bots.js.updateMessage(dl_message, s);
        bot.updateServer(message.channel.server, {
          icon: buffer.toString('base64')
        }, (err) => {
          if (err) {
            bots.js.sendMessage(message.channel, `:warning: An error occured while updating the icon of the Server.\n\`\`\`${err.message}\`\`\``);
            console.log(err.stack);
            return;
          }
          bots.js.sendMessage(message.channel, `Successfully updated the icon of the Server! :ok_hand:`);
        });

      });
      break;
    case 'region':
      if (!_args._[1] || regions.indexOf(_args._[1]) <= -1) {
        bots.js.sendMessage(message.channel, help(settings.prefix));
        return;
      }
      bot.updateServer(message.channel.server, {
        region: _args._[1]
      }, (err) => {
        if (err) {
          bots.js.sendMessage(message.channel, `:warning: An error occured while updating the region of the Server.\n\`\`\`${err.message}\`\`\``);
          return;
        }
        bots.js.sendMessage(message.channel, `Successfully updated the region of the Server to '${_args._[1]}'`);
      });
      break;
    case 'name':
      if (!_args._[1]) {
        bots.js.sendMessage(message.channel, help(settings.prefix));
        return;
      }
      bot.updateServer(message.channel.server, {
        name: _args._[1]
      }, (err) => {
        if (err) {
          bots.js.sendMessage(message.channel, `:warning: An error occured while updating the name of the Server.\n\`\`\`${err.message}\`\`\``);
          return;
        }
        bots.js.sendMessage(message.channel, `Successfully updated the name of the Server to '${_args._[1]}'`);
      });
      break;
    default:

  }
};

function help(prefix) {
  return `\`\`\`Usage:
  ${prefix}updateserver <command>

Commands:
  icon
    !image with maximum size 128x128 required!
    Set image in attachement to the server icon.

  name <name>
    Sets the name of the server.

  region <region>
    Sets the region of the server.
    Available regions are:
      us-west, us-east, us-south, us-central, singapore,
      london, sydney, frankfurt, amsterdam
\`\`\``;
}

exports.help = help;
