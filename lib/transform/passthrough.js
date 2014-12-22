var _ = require('lodash');
var stream = require('stream');
var util = require('util');
var BasePlugin = require('mixdown-app').Plugin;

var PassThroughStream = function(opt) {
  if (!(this instanceof PassThroughStream)) {
    return new PassThroughStream(opt);
  }

  stream.Transform.call(this, _.defaults({
    objectMode: true
  }, opt));

  this.app = opt.app; // in case you need the mixdown app for performing any transforms.
};
util.inherits(PassThroughStream, stream.Transform);


PassThroughStream.prototype._transform = function(chunk, encoding, callback) {

  // simple case - sync processing.  This is good for mapping one object to another.
  // Obviously, this can be async.
  this.push(chunk);
  callback();

};



module.exports = BasePlugin.extend({
  create_stream: function() {
    return new PassThroughStream({
      app: this._options.app
    });
  }
});