var _ = require('lodash');
var BasePlugin = require('mixdown-app').Plugin;
var MemoryStream = require('memory-stream');

module.exports = BasePlugin.extend({
  create_stream: function() {
    return new MemoryStream({
      app: this._options.app,
      objectMode: true
    });
  }
});