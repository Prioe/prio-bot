var parseArgs = require('minimist');
var settings = require('../settings.json');
var fs = require('fs-extra');
var http = require('http');
var https = require('https');
var path = require('path');
var custom_commands = require('../lib/custom-commands.js');
var validator = require('validator');

exports.run = function(bots, commands, message, args) {
  var argOpts = {
    string: ['type', 'name', 'url', 'file-name'],
    boolean: ['random', 'verbose'],
    '--': true,
    alias: {
      'type': 't',
      'name': 'n',
      'verbose': 'v',
    }
  };

  if (!args) {
    bots.js.sendMessage(message.channel, help(settings.prefix));
    return;
  }

  var _args = parseArgs(args.split(' '), argOpts);
  _args.content = _args['--'].join(' ');
  _args.command = (_args._.length != 1) ? 'default' : _args._[0];

  if (_args.verbose) {
    bots.js.sendMessage(message.channel, `\`\`\`${JSON.stringify(_args, null, 2)}\`\`\``);
  }

  switch (_args.command) {
    case 'list':
      var cmds = custom_commands(require('../commands/custom.json'), true);
      var s = '**Available commands**:\n```';
      for (var i = 0; i < cmds.length; i++) {
        s += `${cmds[i].command}, `;
      }
      s = s.replace(/,\s*$/, '');
      s += '```';
      bots.js.sendMessage(message.channel, s);
      break;
    case 'list-local':
      var items = [];
      var source_dir = path.join(__dirname, '../media/custom');
      fs.walk(source_dir)
        .on('data', (item) => {
          if (item.path != source_dir)
            items.push(item);
        }).on('end', function () {
          var s = '**Available local files**:\n```';
          for (var i = 0; i < items.length; i++) {
            s += `${path.basename(items[i].path)}, `;
          }
          s = s.replace(/,\s*$/, '');
          s += '```';
          bots.js.sendMessage(message.channel, s);
        });
      break;
    case 'upload':
      if (message.attachments.length === 0) {
        bots.js.reply(message,
          `:warning: There must be an attachement in the message! Either drag a file into discord and add the command as a comment or click the button left to the chat box and select a file! :warning:`);
        return;
      } else if (message.attachments.length > 1) {
        bots.js.reply(message, `:warning: Only the first attachement will be uploaded.`);
      }
      bots.js.sendMessage(message.channel, 'Uploading to the local file system ...', (err, dl_message) => {
          var attachement = message.attachments[0];
          downloadFile(attachement.url, path.join(__dirname, `../media/custom/${attachement.filename}`), (dl_err) => {
            var s;
            if (dl_err)
              s = `Failed to upload the file:\n\`\`\`${dl_err.message}\`\`\``;
            else
              s = `Successfully uploaded the file. It's accessible from custom commands using '<local>${attachement.filename}' :ok_hand:`;
            bots.js.updateMessage(dl_message, s);
          });
      });
      break;
    case 'download':
      if (!_args['file-name'] || !_args.url) {
        bots.js.sendMessage(message.channel, `${help(settings.prefix)}\n\`\`\`${downloadOpts()}\`\`\``);
        return;
      }
      if (!validator.isURL(_args.url), {require_protocol: true}) {
        bots.js.sendMessage(message.channel, `'${_args.url}' is no valid URL!`);
        return;
      }
      bots.js.sendMessage(message.channel, 'Downloading to the local file system ...', (err, dl_message) => {
        downloadFile(_args.url, path.join(__dirname, `../media/custom/${_args['file-name']}`), (dl_err) => {
          var s;
          if (dl_err)
            s = `Failed to download the file:\n\`\`\`${dl_err.message}\`\`\``;
          else
            s = `Successfully downloaded the file. It's accessible from custom commands using '<local>${_args['file-name']}' :ok_hand:`;
          bots.js.updateMessage(dl_message, s);
        });
      });
      break;
    case 'register':
      var command;
      var o;

      if (!_args.type || !_args.name) {
        bots.js.sendMessage(message.channel, `${help(settings.prefix)}\n:warning: Type and/or Name missing!\`\`\`${typeOpts()}\`\`\``);
        return;
      }

      switch (_args.type) {
        case 'echo':
          if (!_args.content) {
            bots.js.sendMessage(message.channel, `${help(settings.prefix)}\n:warning: Content is missing!\n\`\`\`${contentOpts(_args.type)}\`\`\``);
            return;
          }
          o = {
            type: _args.type,
            name: _args.name,
            content: _args.content
          };

          command = custom_commands({[o.name]: o});
          break;
        case 'audio':
          if (!_args.content) {
            bots.js.sendMessage(message.channel, `${help(settings.prefix)}\n:warning: Content is missing!\n\`\`\`${contentOpts(_args.type)}\`\`\``);
            return;
          }
          o = {
            type: _args.type,
            name: _args.name,
            content: {
              random: _args.random,
              files: []
            }
          };
          var files = _args.content.split(/\s*\|\s*/);
          for (var j = 0; j < files.length; j++) {
            var file = files[j].match(/<(.*)>(.*)/);
            var remote = false;
            if (file[1] == 'local') remote = false;
            else if (file[1] == 'remote') {
              bots.js.sendMessage(message.channel, `Remote files aren't supportet yet!`);
              return;
            } else {
              bots.js.sendMessage(message.channel, `${help(settings.prefix)}\n:warning: The file can only be 'local' or 'remote'!\n\`\`\`${contentOpts(_args.type)}\`\`\``);
              return;
            }
            o.content.files.push({
              file: path.join('../media/custom', file[2]),
              remote: remote
            });
          }
          command = custom_commands({[o.name]: o});
          break;
        default:
      }

      if (command) {
        commands.registerAll(command);
        save(o);
        bots.js.sendMessage(message.channel, `successfully registered command '${_args.name}'`);
      } else {
        bots.js.sendMessage(message.channel, `failed to register command '${_args.name}'`);
      }
      break;
    case 'help':
      bots.js.sendMessage(message.author, helpFull(settings.prefix));
      bots.js.reply(message, 'Sent you the full documentation via DM!');
      break;
    default:
      bots.js.sendMessage(message.channel, help(settings.prefix));
      break;
  }
};

function save(o) {
  var json = require('./custom.json');
  var name = o.name;
  delete o.name;
  json[name] = o;
  fs.outputJson(path.join(__dirname, 'custom.json'), json, (err) => {
    if (err) throw err;
    console.log('  saved custom-commands');
  });

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

exports.help = help;
function help(prefix) {
  return `\`\`\`
Usage:
  ${prefix}${path.basename(__filename, '.js')} <command> [options] [-- <content>]

Type: '${prefix}${path.basename(__filename, '.js')} help' to see the full documentation via DM.
It's to much spam for the chat!
\`\`\``;
}

function downloadOpts() {
  return `  Command: 'download':
    --file-name=<filename> (REQUIRED)
      Set the filename the download will be saved to
    --url=<url> (REQUIRED)
      Set the remote resource to be downloaded.`;
}

function typeOpts() {
  return `Options:
  -t|--type=<type> (REQUIRED)
      Set the type of the command (available: echo|audio)
  -n|--name=<name> (REQUIRED)
      Set the name of the command.`;
}

function contentOpts(type) {
  var echo = `  Type: 'echo':
    The string given as <content> will be written to the channel, the command
    was sent to.`;
  var audio = `  Type: 'audio': (NIY)
    The string given as <content> will be split by the character '|'. The split values
    will be used as the files to be played.
    Each file must use a prefix to specify if it's being stored locally or remotely.
    Although the performance of remote file might be worse under certain circumstances.
    (longer load time)
    Prefixes: <remote>|<local>`;
  var s;
  switch (type) {
    case 'echo':
      return `<content>:\n${echo}`;
    case 'audio':
      return `<content>:\n${audio}`;
    default:
      return `<content>:\n${echo}\n${audio}`;
  }
}

function helpFull(prefix) {
  return `\`\`\`
Usage:
  ${prefix}${path.basename(__filename, '.js')} <command> [options] [-- <content>]

Commands:
  help
      Show this message.
  list (NIY)
      List all registered commands.
  list-local (NIY)
      List all local files, that can be used in commands.
  upload
      Upload a file to the local storage, that can be used from other custom commands.
      Requires a file to be in the attachement. Only the first file will be uploaded.
  download
      Download a remote file to the local storage, that can be used from other custom commands.
      (faster than using remote resources directly!)

${typeOpts()}

Specific options:
  Type: 'audio':
    --random (NIY)
        Set that one random audiofile from the given ones will be played
        Only available for type=audio.

${downloadOpts()}

${contentOpts()}

Examples:
  ${prefix}${path.basename(__filename, '.js')} -t=echo -n=example -- This message will be printed!
  (NIY)${prefix}${path.basename(__filename, '.js')} --type=audio -n=exampleaudio -- <local>exampleaudio.mp3 | <remote>http://www.myurl.to/audiofile.mp3
\`\`\`
  `;
}
