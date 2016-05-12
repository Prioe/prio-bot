function ChatCommands(bots, config, onErr) {
  this._bots = bots;
  this._config = config;
  this._onErr = onErr;
  this._commands = {};
  this._listening = null;
}

ChatCommands.prototype.register = function (command, fun, help) {
  this._commands[command] = { fun: fun, help: help};
};

ChatCommands.prototype.getHelp = function (command) {
  return this._commands[command].help ? this._commands[command].help(this._config.prefix) : "no description";
};

ChatCommands.prototype.registerAll = function (commands) {
  for (var i = 0; i < commands.length; i++) {
    this.register(commands[i].command, commands[i].fun, commands[i].help);
  }
};

ChatCommands.prototype.listen = function (fun) {
  this._listening = fun;
};

ChatCommands.prototype.unlisten = function () {
  this._listening = null;
};

ChatCommands.prototype.flush = function () {
  this._commands = {};
};

ChatCommands.prototype.try = function (message) {
  if (message.author.id === this._bots.js.user.id) return;
  var pattern = `^\\${this._config.prefix}(\\w+)\\ ?(.*)`;
  var match = message.content.match(pattern);
  if (match) {
    try {
      this._commands[match[1]].fun(this._bots, this, message, match[2] || null);
    } catch (e) {
      this._onErr(e, message);
    }
  } else {
    if (this._listening) {
      if (message.content === `${this._config.prefix}${this._config.prefix}${this._config.prefix}unlisten`) {
        this.unlisten();
        this._bots.js.sendMessage(message.channel, 'removed all listeners');
        return;
      }
      this._listening(message);
      return;
    }
  }
};

module.exports = ChatCommands;
