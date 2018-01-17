### Welle Api Documentation for Nodejs

---



#### Well Api Soure Code

Under the `src` directory are the Welle api code, there are:

- `welle_const.js`: Welle predefined constant for communication protocol.
- `welle_serial.js`: Welle serialport communication utilities.
- `welle_decoder.js`: Welle message utilities for data interpretation.
- `welle_api.js`: Welle api related code module.

#### Welle Api Functions

| Function                                 | Properties                               |
| ---------------------------------------- | ---------------------------------------- |
| `connectAny([open, close, error])`       | Periodically finds Welle device and connect to it, if suceeded, `open`,  `close` and `error` callback will be called when serial port is **open**, **close** and **error** ocurred repectively. |
| `startDataflow([success, fail])`         | Send start dataflow command to Welle, **success** and **fail** callback will be invoke based on return command status. If no dataflow output is set, it will output all the data by default. |
| ` stopDataflow([success, fail])`         | Send start dataflow command to Welle, **success** and **fail** callback will be invoke based on return command status. |
| `enableGestureOutput([success, fail])`   | Enable gesture outptut, **success** and **fail** callback will be invoke based on return command status. |
| `disableGestureOutputt([success, fail])` | Disable gesture outptut, **success** and **fail** callback will be invoke based on return command status. |
| `configOutputAllData([success, fail])`   | Setup Welle data output type as output-all-data, **success** and **fail** callback will be invoke based on return command status. |
| `configOutputData([cofig, success, fail])` | Setup Welle data output type as `config` option, **success** and **fail** callback will be invoke based on return command status. |
| `getDeviceInfo([success, fail])`         | Get Device info, **success** and **fail** callback will be invoke based on return command status. |
| `setLedMode(led, mode, success, error)`  | Set led blick mode, **success** and **fail** callback will be invoke based on return command status. |
| `recalibrate([success, error])`          | Recalibating Welle hardware, **success** and **fail** callback will be invoke based on return command status. A success recalibration process will set green led blink tree times. |
| `on(event, handler)`                     | Register `event` handler, events are: `data` `gesture`. When an event is triggered, the corresponding data will be passed to event `handler` function. |
| setDebug(flag)                           | Set debug mode `true` or `false`, it will print sending and recieving data buffer to the terminal if debug is set to `true`. |
|                                          |                                          |
|                                          |                                          |

**event data structure**

| Event Type | Data Structure                           |
| ---------- | ---------------------------------------- |
| `data`     | `{ wPEAK_RAW: [peak_ch1, peak_ch2],  wPEAK_FILTERED: [peak_ch1, peak_ch2],  wPOSITION_RAW: [x, y, z(not used)],  wPOSITION_FILTERED: [x, y, z(not used)],  wENVELOPE: [0:599(ch1), 600:1199(ch2)],  wRAW: [0:1359(ch1), 1360:2719(ch2)] }` |
| `gesture`  | `{ gesture_code: 254, gesture: 'wUNKNOWN', led: 'wLED_1', led_code: 65281 }` |
|            |                                          |



#### 