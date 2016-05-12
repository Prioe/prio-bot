exports.run = function(bots, commands, message, args) {
  if (args) {
    args = args.split(' ');
    for (var cmd in commands._commands) {
      if (!commands._commands.hasOwnProperty(cmd)) return;
      if (cmd == args[0])
        bots.js.sendMessage(message.channel, commands.getHelp(cmd));
    }
  } else {
    var s = '**Available commands:**\n```';
    s += 'type `help <command>` for more info\n';
    for (var cmdi in commands._commands) {
      if (!commands._commands.hasOwnProperty(cmdi)) return;
      s += `${cmdi}\n`;
    }
    s += '```';
    bots.js.sendMessage(message.channel, s);
  }
};

exports.help = function (prefix) {
  return `\`\`\`${prefix}help [COMMAND]
    prints all available commands or a detailed description of a specific command\`\`\``;
};
