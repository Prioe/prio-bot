var settings = require('../settings.json');
var http = require('http');
var https = require('https');

function checkRoleByName (message, name) {
  var roles = message.channel.server.roles;
  for (var i = 0; i < roles.length; i++) {
    if (roles[i].name == name) return true;
  }
  return false;
}

function downloadFile (url, dest, cb) {
  console.log(`downloading file (${url}) to '${dest}'`);
  var protocol = url.indexOf('https') > -1 ? https : http;
  var file = fs.createWriteStream(dest);
  var request = protocol.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
      console.log('finished to download file');
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    console.log('failed to download file\n' + err.stack);
    if (cb) cb(err.message);
  });
}

function downloadFileToBuffer (url, cb) {
  console.log(`downloading file (${url}) to buffer`);
  var protocol = url.indexOf('https') > -1 ? https : http;
  var request = protocol.get(url, function(response) {
    var data = [], dataLen = 0;
    response.on('data', (chunk) => {
      data.push(chunk);
      dataLen += chunk.length;
    });
    response.on('end', () => {
      console.log('finished to download file');
      var buf = new Buffer(dataLen);
      for (var i=0, len = data.length, pos = 0; i < len; i++) {
          data[i].copy(buf, pos);
          pos += data[i].length;
      }
      cb(null, buf);
    });
    request.on('error', (err) => {
      console.warn('failed to download file\n' + err.stack);
      cb(err);
    });
  });
}

exports.checkRoleByName = checkRoleByName;
exports.downloadFile = downloadFile;
exports.downloadFileToBuffer = downloadFileToBuffer;
exports.isSudo = function (message) {
  return checkRoleByName(message, settings.sudo_role);
};
