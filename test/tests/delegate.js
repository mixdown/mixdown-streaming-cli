var assert = require('assert');
var mixdown = require('../fixture/index.js');

suite('Simple Streaming Delegate', function() {
  var app;

  setup(function(done) {
    if (app) {
      return done();
    }

    mixdown.init(function(err) {
      app = mixdown.apps.passthrough;
      done(err);
    });

  });

  test('Stream data', function(done) {
    var source_data = app.source._options.items;

    // the delegate will alert when all streams are drained and the mixdown service has moved into a stopped state.
    // Using this, you can make mixdown re-entrant by calling mixdown.start() again.  Useful for draining a queue.
    mixdown.on('stop', function() {

      var output_memory_stream = mixdown.main.service.delegate.streams[app.id].output;
      var results = output_memory_stream.get();

      // console.log(source_data, results);

      assert.equal(source_data.length, results.length, 'Output count should match');
      assert.deepEqual(source_data, results, 'Output should match');

      done();
    });


    // start the process and the stream
    mixdown.start(assert.ifError.bind(assert));

  });
});