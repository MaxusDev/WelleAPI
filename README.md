## Readme

This repo is for those who love Welle,  want to play with Welle,  and eager to dig deeper into Welle. We are happy to present you the welle protocol and welle api in nodejs. With welle protocol, you can 

1. Interact with welle via your favorite coding language
2. Get your hand dirty on digit signal processing
3. Tune your own finger tracking filter
4. Test your own handwriting recognition algorithm
5. Build your own gesture control projects
6. Many more possibilities, only limited by your imagination


-----



#### Repo Outline

- src 

  Folder that contains source code of api implementation (nodejs)

- example

  Folder that contains example code for API demonstration

- driver

  Folder that contains USB virtual comport driver for win7/8.

- welle_protocol.md

  Documentation of the welle protocol and related data structure.

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

#### Getting Started 

For a quick start, here is an example with nodejs.

```
$ node
```

To dig deeper into Welle,  please refers to welle_protocol for detail instructions.

Enjoy your days with welle