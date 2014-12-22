var Mixdown = require('mixdown');
var assert = require('assert');

var mixdown = new Mixdown(require('./mixdown.js'));

process.on('uncaughtException', assert.ifError.bind(assert));

mixdown.on('error', assert.ifError.bind(assert));

var terminate = function() {
  mixdown.stop(process.exit);
};

var kill = ['SIGTERM', 'SIGINT', 'SIGHUP'];
kill.forEach(function(msg) {
  process.on(msg, terminate);
});

module.exports = mixdown;