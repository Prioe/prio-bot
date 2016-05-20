var Discord = require("discord.js");
var oauth2server = require('./lib/oauth2-server.js');
var ChatCommands = require('./lib/chat-commands.js');
var settings = require('./settings.json');
var walk = require('walk');
var path = require('path');
var IOBot = require('./lib/io-bot.js');
var Twitch = require('./lib/twitch.js');
var custom_commands = require('./lib/custom-commands.js');
var fs = require('fs-extra');

//const pyv = require('child_process').spawn(process.env.PYTHON_PATH + '/python', ['--version']);
//pyv.stderr.on('data', (data) => {
//  if (data === '') return;
//  if (data.toString().match(/2\.7/))
//    console.log(`  using: ${data.toString().replace('\n', '')}`);
//  else
//    console.error(`  warn: please consider using python version 2.7`);
//});

//oauth2server.startOAuth2Server();
var bots = {};
bots.js = new Discord.Client();
bots.io = new IOBot(settings.io_token);
var commands = new ChatCommands(bots, settings, onErr);

initCommands();

bots.js.on("message", function(message) {
  if (message.content === `${settings.prefix}${settings.prefix}${settings.prefix}reinit`) {
    bots.js.reply(message, `**### REINITIATING ALL COMMANDS ###**`);
    initCommands();
    return;
  }

  commands.try(message);
});

bots.js.loginWithToken(settings.token);

var twitch = new Twitch(bots);
twitch.start();

function onErr(err, message) {
  if (settings.verbosity !== 'devel') {
    console.log('invalid command: ' + message.content);
  } else {
    bots.js.sendMessage(message.channel, `'${message.content}' -> \n\n\`\`\`${err.stack}\`\`\``);
    console.log(err.stack);
  }
}

function initCommands() {
  commands.flush();

  var walker = walk.walk(path.join(__dirname, 'commands'));
  walker.on('file', function (root, fileStats, next) {
    if (path.extname(fileStats.name) === '.js' ) {
      console.log(`  registered command '${path.basename(fileStats.name, '.js')}'`);
      var cmd = require(path.join(__dirname, 'commands', fileStats.name));
      commands.register(path.basename(fileStats.name, '.js'), cmd.run, cmd.help);
    }
    next();
  });

  var custom_json = fs.readJsonSync(path.join(__dirname, './commands/custom.json'));
  commands.registerAll(custom_commands(custom_json));
}
