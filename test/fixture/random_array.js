var _ = require('lodash');
var crypto = require('crypto');
module.exports = _.map(_.range(100), function(i) {
  return (new Buffer(crypto.randomBytes(32), 'hex')).toString('base64'); //random strings.
});