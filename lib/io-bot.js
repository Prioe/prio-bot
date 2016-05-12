var DiscordClient = require('discord.io');

function IOBot(token) {
  var bot = new DiscordClient({
      autorun: true,
      token: token
  });

  bot.on('ready', function() {
      console.log(`  ${bot.username} - (${bot.id}) ready`);
  });

  this._bot = bot;

}

module.exports = IOBot;
