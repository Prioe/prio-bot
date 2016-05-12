
var http = require('http');

function Commands(bot, commands) {
  var command_ls = [];

  function leave(message, args) {
  bot.sendMessage(message.channel, 'leaving: ' + bot.user.voiceChannel);
    bot.leaveVoiceChannel(bot.user.voiceChannel, function (err) {
      if (err) throw err;
    });
  }
  command_ls.push({command: 'leave', fun: leave });

  function test(message, args) {
    bot.sendMessage(message.channel, `  #####
      args: ${args}
      channel: ${message.channel}
      author:
        voiceChannel: ${message.author.voiceChannel}
  #####`);
  }
  command_ls.push({command: 'test', fun: test });

  function audiotest(message, args) {
    bot.joinVoiceChannel(message.author.voiceChannel, function (err, connection) {
      console.log(connection.encoder);
      bot.sendMessage(message.channel, `  #####
          voiceChannel: ${message.author.voiceChannel}
          encoder: ${connection.encoder}
    #####`);
      /*connection.playFile(__dirname + 'media/audio/test.wav', {
        volume: 0.8,
      }, function (err, d) {
        if (err)
          throw err;
      });*/
      bot.leaveVoiceChannel(message.author.voiceChannel, function (err) {
        throw err;
      });
    });
  }
  command_ls.push({command: 'audiotest', fun: audiotest});

  function doIn(message, args) {
    if (!args) return;
    var pattern = /(\d+)\ (.*)/;
    var match = args.match(pattern);
    setTimeout(function () {
      bot.sendMessage(message.channel, match[2]);
    }, parseInt(match[1]) * 1000);
  }
  command_ls.push({command: 'in', fun: doIn });

  function trivia(message, args) {
    http.get('http://jservice.io/api/random', (res) => {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var json = JSON.parse(body);
        var current_clue = json[0];
        bot.sendMessage(message.channel, json[0].question + ': ' + json[0].answer);
        commands.listen(trivia_listener);
        function trivia_listener(message) {
          if (message.content.toUpperCase() === current_clue.answer.toUpperCase()) {
            bot.sendMessage(message.channel, 'winner: ' + message.author.name);
            commands.unlisten();
          }
        }

      });
    }).on('error', function (e) {
      commands.unlisten();
      throw e;
    });
  }
  command_ls.push({command: 'trivia', fun: trivia });
9
  command_ls.push({command: 'shrg', fun: shrg });

  return command_ls;
}

module.exports = Commands;
