var path = require('path');

exports.run = function(bots, commands, message, args) {
  var num = parseInt(args);
  if (num == 420) {
    console.log(path.join(__dirname, '../media/img/420.jpg'));
    bots.js.sendFile(message.channel, path.join(__dirname, '../media/img/420.jpg'), '420.jpg', function (err, msg) {
      if (err) {
        throw err;
      }
    });
    return;
  } else if (num > 100) {
    bots.js.sendMessage(message.channel, 'gr8 b8 m8 i r8 8/8. **¯\\_(ツ)_/¯**');
    return;
  }
  if (!num || num <= 0) {
    bots.js.sendMessage(message.channel, 'gr8 b8 m8 i r8 8/8. **¯\\_(ツ)_/¯**');
    return;
  }
  var s = '';
  for (var i = 0; i < num; i++) {
    s += i%2 === 0 ? '¯\\_(ツ)_/¯\n' : '**¯\\_(ツ)_/¯\n**';
  }
  bots.js.sendMessage(message.channel, s);
};
