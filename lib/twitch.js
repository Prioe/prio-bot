var irc = require("tmi.js");
var settings = require('../settings.json');
var moment = require('moment');

function Twitch(bots) {
  this._bots = bots;
  this.init();
}

Twitch.prototype.init = function () {
  var options = {
      options: {
          debug: true
      },
      connection: {
          cluster: "aws",
          reconnect: true
      },
      identity: {
          username: settings.twitch_username,
          password: settings.twitch_oauth
      },
      channels: settings.twitch_channels,
      logger: {
        info: (msg) => {
          console.log(`<twitch-info>: ${msg}`);
          //this._bots.js.sendMessage(settings.twitch_textchannel, `${msg}`);
        },
        warn: (msg) => {
          console.log(`<twitch-warn>: ${msg}`);
          //this._bots.js.sendMessage(settings.twitch_textchannel, `warn:  ${msg}`);
        },
        error: (msg) => {
          console.log(`<twitch-error>: ${msg}`);
          //this._bots.js.sendMessage(settings.twitch_textchannel, `error: ${msg}`);
        },
      }
  };

  this._client = new irc.client(options);
};

Twitch.prototype.start = function () {
  this._client.connect();
  this._client.on('chat', (channel, user, message, self) => {
    this._bots.js.sendMessage(settings.twitch_textchannel, `\`${channel.replace('#', '')}\` [${moment().format('HH:mm')}] **${user['display-name']}:** ${message}`);
  });
  this._client.on('action', (channel, user, message, self) => {
    this._bots.js.sendMessage(settings.twitch_textchannel, `\`${channel.replace('#', '')}\` [${moment().format('HH:mm')}] **${user['display-name']}:** *${message}*`);
  });
  return this._client;
};

Twitch.prototype.stop = function () {
  this._client.disconnect();
};

module.exports = Twitch;
