const shell = require('shelljs');
const prompt = require('prompt');
const fs = require('fs');
const axios = require('axios');
const colors = require('colors/safe');
const url = require('url');
const R = require('ramda');

var config = { AUTH_REQUEST: {}, TOKEN_REQUEST: {} };
var oldConfig;

prompt.message = colors.blue(">");
prompt.start();
prompt.get({
  properties: {
    distribution: {
      message: colors.red("Enter distribution name"),
      required: true
    }
  }
}, function (err, result) {
  config.DISTRIBUTION = result.distribution;
  shell.mkdir('-p', 'distributions/' + config.DISTRIBUTION);
  if (fs.existsSync('distributions/' + config.DISTRIBUTION + '/config.json')) {
    oldConfig = JSON.parse(fs.readFileSync('./distributions/' + config.DISTRIBUTION + '/config.json', 'utf8'));
  }
  if (!fs.existsSync('distributions/' + config.DISTRIBUTION + '/id_rsa') || !fs.existsSync('./distributions/' + config.DISTRIBUTION + '/id_rsa.pub')) {
    shell.exec("ssh-keygen -t rsa -m PEM -b 4096 -f ./distributions/" + config.DISTRIBUTION + "/id_rsa -N ''");
    shell.exec("openssl rsa -in ./distributions/" + config.DISTRIBUTION + "/id_rsa -pubout -outform PEM -out ./distributions/" + config.DISTRIBUTION + "/id_rsa.pub");
  }
  microsoftConfiguration();
});

function microsoftConfiguration() {
  prompt.message = colors.blue(">>");
  prompt.start();
  prompt.get({
    properties: {
      TENANT: {
        message: colors.red("Tenant"),
        required: true,
        default: R.pathOr('', ['TENANT'], oldConfig)
      },
      CLIENT_ID: {
        message: colors.red("Client ID"),
        required: true,
        default: R.pathOr('', ['AUTH_REQUEST', 'client_id'], oldConfig)
      },
      CLIENT_SECRET: {
        message: colors.red("Client Secret"),
        required: true,
        default: R.pathOr('', ['TOKEN_REQUEST', 'client_secret'], oldConfig)
      },
      REDIRECT_URI: {
        message: colors.red("Redirect URI"),
        required: true,
        default: R.pathOr('', ['AUTH_REQUEST', 'redirect_uri'], oldConfig)
      },
      SESSION_DURATION: {
        message: colors.red("Session Duration (hours)"),
        required: true,
        default: R.pathOr('', ['SESSION_DURATION'], oldConfig)/60/60
      },
    }
  }, function(err, result) {
    config.PRIVATE_KEY = fs.readFileSync('distributions/' + config.DISTRIBUTION + '/id_rsa', 'utf8');
    config.PUBLIC_KEY = fs.readFileSync('distributions/' + config.DISTRIBUTION + '/id_rsa.pub', 'utf8');
    config.TENANT = result.TENANT;
    config.DISCOVERY_DOCUMENT = 'https://login.microsoftonline.com/' + result.TENANT + '/v2.0/.well-known/openid-configuration';
    config.SESSION_DURATION = parseInt(result.SESSION_DURATION, 10) * 60 * 60;

    config.CALLBACK_PATH = url.parse(result.REDIRECT_URI).pathname;

    config.AUTH_REQUEST.client_id = result.CLIENT_ID;
    config.AUTH_REQUEST.redirect_uri = result.REDIRECT_URI;
    config.AUTH_REQUEST.response_type = 'code';
    config.AUTH_REQUEST.response_mode = 'query';
    config.AUTH_REQUEST.scope = 'openid email profile';

    config.TOKEN_REQUEST.client_id = result.CLIENT_ID;
    config.TOKEN_REQUEST.grant_type = 'authorization_code';
    config.TOKEN_REQUEST.redirect_uri = result.REDIRECT_URI;
    config.TOKEN_REQUEST.client_secret = result.CLIENT_SECRET;

    shell.cp('./authz/microsoft.js', './distributions/' + config.DISTRIBUTION + '/auth.js');
    shell.cp('./authn/openid.index.js', './distributions/' + config.DISTRIBUTION + '/index.js');
    shell.cp('./nonce.js', './distributions/' + config.DISTRIBUTION + '/nonce.js');

    fs.writeFileSync('distributions/' + config.DISTRIBUTION + '/config.json', JSON.stringify(result, null, 4));
    writeConfig(config, zip, ['config.json', 'index.js', 'auth.js', 'nonce.js']);
  });
}

function zip(files) {
  var filesString = '';
  for (var i = 0; i < files.length; i++) {
    filesString += ' distributions/' + config.DISTRIBUTION + '/' + files[i] + ' ';
  }
  shell.exec('zip -q distributions/' + config.DISTRIBUTION + '/' + config.DISTRIBUTION + '.zip ' + 'package-lock.json package.json -r node_modules');
  shell.exec('zip -q -r -j distributions/' + config.DISTRIBUTION + '/' + config.DISTRIBUTION + '.zip ' + filesString);
  console.log(colors.green("Done... created Lambda function distributions/" + config.DISTRIBUTION + "/" + config.DISTRIBUTION + ".zip"));
}

function writeConfig(result, callback, files) {
  fs.writeFile('distributions/' + config.DISTRIBUTION + '/config.json', JSON.stringify(result, null, 4), (err) => {
    if (err) throw err;
    callback(files);
  });
}
