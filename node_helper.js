'use strict';

/* Magic Mirror
 * Module: MMM-ioBroker
 *
 * By Benjamin Roesner http://benjaminroesner.com
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
var http;
var https;

module.exports = NodeHelper.create({
  start: function() {
    this.config = {};
  },

  request: function (url, callback) {
    var _http;
    if (url.match(/^https:/)) {
      _http = https || require('https');
    } else {
      _http = http  || require('http');
    }
    _http.get(url, function (res) {
      var contentType = res.headers['content-type'];

      var error;
      if (res.statusCode !== 200) {
        error = new Error('Request Failed.\n Status Code: ' + res.statusCode);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.Expected application/json but received ' + contentType);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        callback();
        return;
      }

      res.setEncoding('utf8');

      var rawData = '';

      res.on('data', function (chunk) {
        rawData += chunk;
      });

      res.on('end', function () {
        callback(rawData);
      });
    }).on('error', function (e) {
      callback();
      console.error('Got error: ' + e.message);
    });
  },

  getIobJson: function (config, callback) {
    var count = 0; // works even for node 0.10
    var result = {};
    var url = 'http' + (config.https ? 's' : '') + '://' + (config.host || 'localhost') + ':' + (config.port || 8082) + '/state/';
    var that = this;

    for (var i = 0; i < config.devices.length; i++) {
      for (var s = 0; s < config.devices[i].deviceStates.length; s++) {
        count++;
        (function (_id) {
          that.request(url + _id, function (body) {
            var data = {val: '-'};
            try {
              data = JSON.parse(body || '{"val": "-"}');
            } catch (e) {
              console.error('Cannot read value: ' + body + ' => ' + e);
            }
            result[_id] = data.val;
            if (!--count) callback(result);
          });
        })(config.devices[i].deviceStates[s].id);
      }
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GETDATA') {
      var self = this;
      self.config = payload;
      this.getIobJson(this.config, function (data) {
        self.sendSocketNotification('DATARECEIVED', data);
      });
    }
  }
});
