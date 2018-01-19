## Readme

This repo is for those who love Welle,  want to play with Welle,  and eager to dig deeper into Welle. We are happy to present you the welle protocol and welle api in nodejs. With welle protocol, you can 

1. Interact with welle via your favorite coding language
2. Get your hand dirty on digit signal processing
3. Tune your own finger tracking filter
4. Test your own handwriting recognition algorithm
5. Build your own gesture control projects
6. Many more possibilities, only limited by your imagination


[**Click Here to GET WELLE**](https://www.indiegogo.com/projects/welle-turn-any-surface-into-a-smart-interface-gadget) and get started !

![welle_display](https://github.com/MaxusDev/WelleAPI/blob/master/image/welle_display.gif)

-----



#### Repo Outline

- src 

  Folder that contains source code of api implementation (nodejs)

- driver

  Folder that contains USB virtual comport driver for win7/8.

- Welle_Protocol.md

  Documentation of the welle protocol and related data structure.

- Welle_Api.md


  Welle Api Documentation for Nodejs

- Readme.md

---

#### Connectivity

Welle provide USB and BLE access. Following steps guide you to correctly connet to welle



**Connect Welle via USB**

Welle USB port will act as virtual com port when connected to your PC or laptop.

- For MacOS users, there will be a tty device indicating that welle is connected.

```shell
$ ls /dev/tty.usb*
/dev/tty.usbmodem1411
```

- For linux user,there will be a tty device indicating that welle is connected. (tested on Ubuntu 16.04)

```Shell
$ ls /dev/ttyACM*
/dev/ttyACM0
```

- For win10 users,  the system will find the necessary driver automatically. Then goto device manager, you will find a new comport  i.e.,  COM3.
- For other windows user,  first follow the instruction in folder `driver` to install suitable driver. Then goto device manager, you will find a new comport  i.e.,  COM3.



**Recommanded Serial Tools**

After you find your com port, use your favorite serial tool to connect to welle.

- For mac, `coolterm` is recommended
- For window, `taraterm` will be a nice choice
- For linux, 

Select the correct com port. Select the highest baudrate your serial tool supports. Then connect to Welle.



**Connect Welle via BLE**

- First make sure welle is in active mode, (interactive LED is on or blinking)
- Scan for BLE device with your favorite BLE tool. (LightBlue on iOS or android recommended)
- The welle BLE name will be Welle-xxxxxxxx
- Connect

---

####  

#### Setup

- Install Node **v7.4.0** and above
- Run `npm install`  to install project dependencies specified in `package.json`
- After dependencies have been installed, follow the **Quick Start** guidline to kickoff, or you can run `node example.js` to have a further understanding of the Welle Api

---

#### Quick Start

**Quick Start: Getting gesture output**

1. Run the following command in `node` runtime under the project parent directory

2. Import Welle Api: `var welleAPI = require('./src/welle_api.js');`

3. Connect to Welle device: `welleAPI.connectAny();`

4. Enable gesture output: `welleAPI.enableGestureOutput();`

5. Register gesture event handler: 

   ```javascript
   welleAPI.on('gesture', function(gesture){
   	console.log('onGesture: ', gesture);	
   });
   ```

6. Make sure you **disable gesture output** before exit: `welleAPI.disableGestureOutput()`

**Quick Start: Getting coordinate data flow output**

1. Run the following command in `node` runtime under the project parent directory

2. Import Welle Api: `var welleAPI = require('./src/welle_api.js');`

3. Connect to Welle device: `welleAPI.connectAny();`

4. Config output dataflow type: `welleAPI.configOutputData(['wPOSITION_FILTERED']);`

5. Register dataflow event handler: 

   ```javascript
   welleAPI.on('data', function(data){
   	console.log('onData: ', data);	
   });
   ```

6. Start dataflow: `welleAPI.startDataflow();`

7. Make sure you **stop dataflow before you exit**: `welleAPI.stopDataflow();`


To dig deeper into Welle,  please refers to welle_protocol for detail instructions.

Enjoy your days with welle



#### Data Visualization

To quickly visualize what the data look like, we prepare a little project for you to interact with. To get started please follow the instruction beblow.

- Go to **display** directory: `cd display`
- Run node command: `node index.js`
- Open your web browser and enter: `http://localhost:3000`
- Choose the data you wish to play with in the setting panel. 




![welle_display](https://github.com/MaxusDev/WelleAPI/blob/master/image/welle_display.gif)