const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();


let internal;

const config = {
    host: 'localhost',
    port: '8082',
    https: false,
    devices: [
        {
            deviceName: 'writeHereTheName1',
            deviceStates: [
                {id: 'mqtt.0.sensorX.temperature',  icon: 'wi wi-thermometer',  suffix: '&deg;'},
                {id: 'mqtt.0.sensorX.humidity',     icon: 'wi wi-humidity',     suffix: '%'}
            ]
        },
        {
            deviceName: 'writeHereTheName2',
            deviceStates: [
                {id: 'mqtt.0.sensorY.temperature',  icon: 'wi wi-thermometer',  suffix: '&deg;'},
                {id: 'mqtt.0.sensorY.battery',      icon: 'fa fa-battery-half', suffix: ''}
            ]
        }
    ]
};

function NodeHelper(options) {
    this.start = options.start;
    this.request = function (url, callback) {
        if (url.indexOf('mqtt.0.sensorX.temperature') !== -1) {
            setTimeout(callback, 0, JSON.stringify({val: '15'}));
        } else
        if (url.indexOf('mqtt.0.sensorY.temperature') !== -1) {
            setTimeout(callback, 0, JSON.stringify({val: '17'}));
        } else
        if (url.indexOf('mqtt.0.sensorX.humidity') !== -1) {
            setTimeout(callback, 0, JSON.stringify({val: 67}));
        } else
        if (url.indexOf('mqtt.0.sensorY.battery') !== -1) {
            setTimeout(callback, 0, JSON.stringify({val: 15}));
        }
    };
    this.getIobJson = options.getIobJson;
    this.socketNotificationReceived = options.socketNotificationReceived;
    return this;
}

describe('Test ioBroker', () => {
    it('Test ioBroker', done => {
        const helper = proxyquire(__dirname + '/../node_helper', {
            'node_helper': {
                create: function (options) {
                    internal = new NodeHelper(options);

                    internal.sendSocketNotification = (notification, payload) => {
                        expect(payload['mqtt.0.sensorX.temperature']).to.be.equal('15');
                        expect(payload['mqtt.0.sensorX.humidity']).to.be.equal(67);
                        expect(payload['mqtt.0.sensorY.temperature']).to.be.equal('17');
                        expect(payload['mqtt.0.sensorY.battery']).to.be.equal(15);
                        done();
                    };
                    internal.socketNotificationReceived('GETDATA', config);
                }
            }
        });
    });
});