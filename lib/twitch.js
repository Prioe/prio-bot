var irc = require("tmi.js");
var settings = require('../settings.json');

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
          this._bots.js.sendMessage(settings.twitch_textchannel, `${msg}`);
        },
        warn: (msg) => {
          this._bots.js.sendMessage(settings.twitch_textchannel, `warn:  ${msg}`);
        },
        error: (msg) => {
          this._bots.js.sendMessage(settings.twitch_textchannel, `error: ${msg}`);
        },
      }
  };

  this._client = new irc.client(options);
};

Twitch.prototype.start = function () {
  this._client.connect();
};

Twitch.prototype.stop = function () {
  this._client.disconnect();
};

module.exports = Twitch;
