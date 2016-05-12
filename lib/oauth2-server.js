var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');

var app = express();

function startOAuth2Server() {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.oauth = oauthserver({
    model: {}, // See below for specification
    grants: ['password'],
    debug: true
  });

  app.all('/oauth/token', app.oauth.grant());

  app.get('/', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
  });

  app.use(app.oauth.errorHandler());

  app.listen(3000);
  console.log('  started oauth2-server');
}

exports.startOAuth2Server = startOAuth2Server;
