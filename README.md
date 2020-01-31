# Module: MMM-ioBroker
This [MagicMirror](https://github.com/MichMich/MagicMirror) module, shows values like temperature/humidity of [ioBroker](http://ioBroker.net) devices.

![Magic-Mirror Module MMM-ioBroker screenshot](https://github.com/BenRoe/MMM-FHEM/raw/gh-pages/Screenshot1.png?raw=true)
![Magic-Mirror Module MMM-ioBroker screenshot](https://github.com/BenRoe/MMM-FHEM/raw/gh-pages/Screenshot2.png?raw=true)

## Dependencies
- An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
- In ioBroker the installation of adapter [simpleAPI](https://github.com/ioBroker/ioBroker.simple-api)

## Installation

Navigate into your MagicMirror's `modules` folder:
```
cd ~/MagicMirror/modules
```

Clone this repository:
```
git clone https://github.com/ioBroker/MMM-ioBroker
```

Configure the module in your `config.js` file.

## Update the module

Navigate into the `MMM-ioBroker` folder with `cd ~/MagicMirror/modules/MMM-ioBroker` and get the latest code from Github with `git pull`.

If you haven't changed the modules, this should work without any problems. Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
```javascript
modules: [
  {
    module: 'MMM-ioBroker',
    position: 'bottom_bar',
    config: {
      host: 'localhost',
      port: '8082',
      https: false,
      template: 'MMM-ioBorker.njk',
      devices: [
          { name: 'writeHereTheName1',
            deviceStates: [
                              { id: 'mqtt.0.sensorX.temperature', icon: 'wi wi-thermometer', suffix: '&deg;' },
                              { id: 'mqtt.0.sensorX.humidity',    icon: 'wi wi-humidity',    suffix: '%' }
                          ]
          },
          { name: 'writeHereTheName2',
            deviceStates: [
                              { id: 'mqtt.0.sensorY.temperature', icon: 'wi wi-thermometer',  suffix: '&deg;' },
                              { id: 'mqtt.0.sensorY.battery',     icon: 'fa fa-battery-half', suffix: '' }
                          ]
          }
        ]
    }
  }
]
```

## Configuration options

The following properties can be configured:

<table  width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>host</code></td>
			<td>Hostname/IP of the ioBroker Server.
            Is only necessary, if ioBroker and Magic-Mirror is <u>not</u> on the same machine (Raspberry Pi).<br>
            <b>Possible values:</b> <code>localhost</code> or a IP<br>
			<b>Default value:</b> <code>localhost</code>
			</td>
		</tr>
		<tr>
			<td><code>port</code></td>
			<td>ioBroker web Port<br>
                <b>Possible values:</b> any number<br>
                <b>Default value:</b> <code>8082</code>
			</td>
		</tr>
        <tr>
			<td><code>https</code></td>
			<td>If your ioBroker use https<br>
                <b>Possible values:</b> <code>true</code> or <code>false</code><br>
                <b>Default value:</b> <code>false</code>
			</td>
		</tr>
        <tr>
            <td><code>template</code></td>
            <td>Name of the used nunjucks template file<br>
                <b>Possible values:</b> any template file in the MMM-ioBoker directory<br>
                <b>Default value:</b> 'MMM-ioBroker.njk'<br>
                Using a user Nunjuck template file you may change the output. E.g. change the color of an Item or skip it, if usefull.<br>
                see [Homepage of Nunjucks](https://mozilla.github.io/nunjucks/)
            </td>
        </tr>
        <tr>
			<td><code>devices</code></td>
			<td>Array of objects. Object for the different ioBroker devices.
<pre><code>
{ name: 'yourNameHere1',
  deviceStates: [
     { id: 'mqtt.0.device1.temperature',  icon: 'wi wi-thermometer', suffix: '&deg;' },
     { id: 'mqtt.0.device1.mqtthumidity', icon: 'wi wi-humidity',    suffix: '%'     },
  ],
},
</code></pre>
            <b>name</b>: Just a text, that will be shown as title.
            <br />
            <b>deviceStates</b>: array of states for the device readings you want to display.
            <br />
            <b>id:</b> ID of the state (Required). Go to the ioBroker admin, find the state ID.
            <br>
            <b>icon:</b> CSS class of an icon (<a href="http://fontawesome.io/icons/">Font-Awesome</a> and <a href="https://erikflowers.github.io/weather-icons/">Weather Icons</a> are pre installed)
            <br>
            <b>suffix:</b> any string/text
            </td>
		</tr>
        <tr>
			<td><code>initialLoadDelay</code></td>
			   <td>The initial delay before loading. (Milliseconds)<br>
               <b>Default value:</b> <code>1000</code> (1 second)
			</td>
        </tr>
        <tr>
			<td><code>updateInterval</code></td>
			<td>Content update interval in Milliseconds.<br>
               <b>Possible values:</b> <code>1000</code> (1 second) to <code>86400000</code> (24 hours)<br>
			   <b>Default value:</b> <code>60000</code> (1 minute)
			</td>
		</tr>
	</tbody>
</table>
