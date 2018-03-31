'use strict';

/* Magic Mirror
 * Module: MMM-ioBroker
 *
 * By Benjamin Roesner http://benjaminroesner.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var _ = require('underscore');

module.exports = NodeHelper.create({
  start: function() {
    this.config = {};
  },

  getIobJson: function (config, callback) {
    var count = 0; // works even for node 0.10
    var result = {};
    var url = 'http' + (config.https ? 's' : '') + '://' + (config.host || 'localhost') + ':' + (config.port || 8082) + '/state/';

    for (var i = 0; i < config.devices.length; i++) {
      for (var s = 0; s < config.devices[i].deviceStates.length; s++) {
        count++;
        (function (_id) {
          request(url + '_id', function (error, response, body) {
            if (!error && response.statusCode === 200) {
              var data = {val: '-'};
              try {
                data = JSON.parse(body);
              } catch (e) {
                console.error('Cannot read value: ' + e);
              }
              result[_id] = data.val;
            }
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
