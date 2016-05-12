exports.run = function(bots, commands, message, args) {
  var s =
`\`\`\`
    args: ${args}
    channel: ${message.channel}
    author:
      voiceChannel: ${message.author.voiceChannel}
\`\`\``;
  bots.js.sendMessage(message.channel, s);
  bots.js.sendMessage('179026843591114752', s)
  console.log(s);
};
