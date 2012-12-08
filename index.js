var async = require("async");
var funcUtils = require("./lib/func_utils");
var counters = require("./lib/counters");
var Timer = require("./lib/timer");
var atoll = require("atoll");

var statFunctions = ["mean", "stdDev", "median", "mode", "variance"];

module.exports = function runner(opts) {
  var timer = Timer();

  var pipe = funcUtils.buildPipe(opts, timer);
  opts.bench = async.apply(async.waterfall, pipe);

  counters.preHeatRunCounter(opts, function(err) {
    if(err) {
      funcUtils.always(opts.complete)(err);
      return;
    }

    var builder = function(acc, e) {
      acc[e] = atoll[e](timer.results);
      return acc;
    };

    var results = statFunctions.reduce(builder, {});

    funcUtils.always(opts.complete)(null, results);
  });
}
