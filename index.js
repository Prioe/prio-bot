var Discord = require("discord.js");
var ChatCommands = require('./lib/chat-commands.js');
var settings = require('./settings.json');
var walk = require('walk');
var path = require('path');
var IOBot = require('./lib/io-bot.js');
var Twitch = require('./lib/twitch.js');
var custom_commands = require('./lib/custom-commands.js');
var fs = require('fs-extra');

var bots = {};
var commands;
var twitch;


function start() {
  console.log(`running node version ${process.version}`);
  console.log('starting bot ...');
  bots.js = new Discord.Client();
  console.log('started bot');
  //bots.io = new IOBot(settings.io_token);
  commands = new ChatCommands(bots, settings, onErr);

  initCommands();

  bots.js.on("message", function(message) {
    if (message.content === `${settings.prefix}${settings.prefix}${settings.prefix}reinit`) {
      bots.js.reply(message, `**### REINITIATING ALL COMMANDS ###**`);
      initCommands();
      return;
    } else if (message.content === `${settings.prefix}${settings.prefix}${settings.prefix}restart`) {
      try {
        bots.js.reply(message, `**### RESTARTING BOT ###**\nnot implemented yet`);
      } catch (e) {}
      //restart();
      return;
    }

    commands.try(message);
  });

  bots.js.loginWithToken(settings.token);

  console.log('starting twitch-bot ...');
  twitch = new Twitch(bots);
  twitch.start();
  console.log('started twitch-bot');
}

function restart() {
  bots.js.logout();
  //twitch.stop();
  bots = {};
  twitch = null;
  start();
}

function onErr(err, message) {
  if (settings.verbosity !== 'devel') {
    console.log('invalid command: ' + message.content);
  } else {
    bots.js.sendMessage(message.channel, `'${message.content}' -> \n\n\`\`\`${err.stack}\`\`\``);
    console.log(err.stack);
  }
}

function initCommands() {
  console.log('initiating commands ...');
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

  walker.on('end', function () {
    var custom_json = fs.readJsonSync(path.join(__dirname, './commands/custom.json'));
    commands.registerAll(custom_commands(custom_json));
    console.log('initiated commands');
  });
}

var didCleanup = false;
function cleanup(callback) {
  if (didCleanup) callback();
  console.log('doing cleanup');
  var ch = null;
  try {
    ch = bots.js.user.voiceChannel;
  } catch (e) {}
  if (ch === null) {
    didCleanup = true;
    callback();
  }
  console.log('leaving current channel ' + ch);
  bots.js.leaveVoiceChannel(ch).catch(function (e) {
    console.log('something bad happened while leaving the voice channel:\n' + e.stack);
    didCleanup = true;
    callback();
  }).then(function () {
    console.log('left channel');
    didCleanup = true;
    callback();
  });
}

start();

process.on('exit', cleanup.bind(null, process.exit));
process.on('SIGINT', cleanup.bind(null, process.exit));
//process.on('SIGTERM', cleanup.bind(null, process.exit));
//process.on('SIGHUP', cleanup.bind(null, process.exit));
//process.on('SIGUSR1', cleanup.bind(null, process.exit));
//process.on('SIGUSR2', cleanup.bind(null, process.exit));
//process.on('uncaughtException', cleanup.bind(null, process.exit));
