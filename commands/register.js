var parseArgs = require('minimist');
var settings = require('../settings.json');
var fs = require('fs-extra');
var path = require('path');
var custom_commands = require('../lib/custom-commands.js');

exports.run = function(bots, commands, message, args) {
  var argOpts = {
    string: ['type', 'name'],
    boolean: ['help'],
    '--': true,
    alias: {
      'type': 't',
      'name': 'n',
      'help': 'h'
    }
  };

  if (!args) {
    bots.js.sendMessage(message.channel, help());
    return;
  }

  var _args = parseArgs(args.split(' '), argOpts);
  _args.content = _args['--'].join(' ');

  if (_args.help || !_args.type || !_args.type || !_args.content) {
    bots.js.sendMessage(message.channel, help());
    return;
  }

  var command;
  var o;

  switch (_args.type) {
    case "echo":
      o = {
        type: _args.type,
        name: _args.name,
        content: _args.content,
        approved: settings.custom_commands.auto_approve.indexOf(_args.type) != -1
      };

      command = custom_commands({[o.name]: o});
      break;
    default:

  }

  if (command) {
    commands.registerAll(command);
    save(o);
    bots.js.sendMessage(message.channel, `successfully registered command '${_args.name}'`);
  } else {
    bots.js.sendMessage(message.channel, `failed to register command '${_args.name}'`);
  }


};

function save(o) {
  var json = require('./custom.json');
  var name = o.name;
  delete o.name;
  json[name] = o;
  fs.outputJson(path.join(__dirname, 'custom.json'), json, (err) => {
    if (err) throw err;
    console.log('  saved custom-commands');
  });

}

function help() {
  return `
  **Usage:**

\`\`\`
${settings.prefix}register --type=<type> --name=<name> -- <content>
\`\`\`

  *legal types:*

\`\`\`
echo: print content to text channel
\`\`\`
  `;
}
