var _ = require('lodash');
var BasePlugin = require('mixdown-app').Plugin;
var util = require('util');
var Readable = require('stream').Readable;

var ArrayStream = function(options) {

  if (!(this instanceof ArrayStream)) {
    return new ArrayStream(opt);
  }

  options = options || {};

  this.buffer = options.items || [];
  Readable.call(this, _.extend(options, {
    objectMode: true
  }));
}

util.inherits(ArrayStream, Readable);

ArrayStream.prototype._read = function() {
  if (this.buffer.length > 0) {
    this.push(this.buffer.shift());
  } else {
    this.push(null);
  }
}

module.exports = BasePlugin.extend({
  create_stream: function() {
    return new ArrayStream({
      items: _.clone(this._options.items)
    });
  }
});