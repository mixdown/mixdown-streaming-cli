var _ = require('lodash');
var optimist = require('optimist');

var argv = optimist
  .alias('s', 'services')
  .describe('services', 'Comma separated list of services to start. Default: run all services')
  .argv;

// This export must return an object (or class) with start/stop functions.
// When mixdown calls start, mixdown.apps is already initialized.  This is true for start and reload scenarios.
module.exports = function(mixdown, options) {
  this.mixdown = mixdown;
  this.options = options;
  var self = this;
  var writeCount = {};
  var lastSaveTime = {};
  var lastSaveCount = {};
  var appsRunning = 0;
  this.streams = {};

  // Start doing stuff.  This should start service or resume the service if stop was previously called.
  this.start = function(done) {

    runnableApps = mixdown.apps;

    // if the services flag was passed from cmd line, then only run the specified services.
    if (argv.services) {
      logger.info('Filtering services');
      runnableApps = _.pick(runnableApps, argv.services.trim().split(/\s*,\s*/g));
    }
    logger.info('Apps starting', Object.keys(runnableApps));
    logger.debug(runnableApps);

    _.each(runnableApps, function(app, appid) {
      try {
        writeCount[appid] = 0;
        lastSaveCount[appid] = 0;
        lastSaveTime[appid] = new Date();
        appsRunning++;

        // logger.debug(app.transformer.source_stream);
        var input = app.source.create_stream(app);
        var transform = app.transform.create_stream(app);
        var output = app.output.create_stream(app);

        // attach this state to the delegate so that outside modules can access the latest streams.  
        // This was added for unit test support.
        self.streams[appid] = {
          input: input,
          transform: transform,
          output: output
        };

        input.on('warn', function(err, chunk) {
          logger.info('Input Warn', err, err.stack, JSON.stringify(chunk));
        });

        transform.on('warn', function(err, chunk) {
          logger.info('Transform Warn', err, err.stack);
        });

        output.on('error', function(err) {
          logger.error('Output Error', err, err.stack);
        });

        output.on('finish', function() {
          if (!isNaN(output.push_count)) {
            logger.info(output.push_count, 'outputs');
            logger.info(output.error_count, 'errors');
          }
          appsRunning--;
          logger.info(appid + ' finished running');

          if (appsRunning === 0) {
            self.stop();
          }
        });


        output.on('save', function(obj) {
          var dt = lastSaveTime[appid];
          var dtNow = new Date();
          var secs = (Math.abs(dtNow - dt) / 1000);

          // logger.info('save ' + obj.id);
          logger.debug(obj);
          writeCount[appid] += _.isArray(obj) ? obj.length : 1;

          if (secs > 1) {
            var diff = writeCount[appid] - lastSaveCount[appid];

            // update last log counters
            lastSaveTime[appid] = dtNow;
            lastSaveCount[appid] = writeCount[appid];

            // Send to logs.
            logger.info(appid, diff, secs + 's', (diff / secs).toFixed(1) + ' rec/sec.');
            // logger.debug('write doc', obj);
          }

        });

        input.pipe(transform).pipe(output);
      } catch (ex) {
        logger.error(ex);
        logger.error(ex.stack)
      }
    });

    done();
  };

  // stop running the app.  stop() is responsible for pausing processing, saving state, or whatever so that it can pick up where it left off.
  // This is called on shutdown and also called on reload from config.
  this.stop = function(done) {
    this.mixdown.emit('stop');
    return typeof(done) === 'function' ? done() : null;
  };
};