var _ = require('lodash');
var BasePlugin = require('mixdown-app').Plugin;
var util = require('util');
var Writable = require('stream').Writable;

var ConsoleStream = function(options) {
  if (!(this instanceof ConsoleStream)) {
    return new ConsoleStream(opt);
  }

  options = options || {};
  this.push_count = 0;
  Writable.call(this, _.extend(options, {
    objectMode: true
  }));
}

util.inherits(ConsoleStream, Writable);

ConsoleStream.prototype._write = function(chunk, encoding, callback) {
  this.push_count++;
  this.emit('save', chunk);
  console.log(JSON.stringify(chunk, null, 2));
  callback();
};

module.exports = BasePlugin.extend({
  create_stream: function() {
    return new ConsoleStream({
      app: this._options.app
    });
  }
});