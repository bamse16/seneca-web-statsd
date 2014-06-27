'use strict';
var parse = require('url').parse;
var _ = require('underscore');

// Add an express-statsd key that looks like http.post.api.hello.world for a HTTP POST to /api/hello/world URL
// See https://github.com/uber/express-statsd

module.exports = {
  startwareFunc: function(filterPath) {
    return function (req, res, callback){
      var hostname = process.env.NODE_STATSD_PREFIX || os.hostname();
      var env = process.env.NODE_ENV || 'production';
      var method = req.method || 'unknown_method';
      method = method.toLowerCase();

      var urlName = req.url || 'unknown_url';
      var path = parse(urlName).pathname.toLowerCase();
      path = path.replace(/\//g, ' ').trim().replace(/\s/g, '.');

      if(_.isFunction(filterPath)){
        path = filterPath(path);
      }

      req.statsdKey = [hostname, env, 'http', method, path].join('.');

      return callback(null);
    }
  }
};
