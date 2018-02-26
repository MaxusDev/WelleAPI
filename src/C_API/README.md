# Welle C API

This folder is for developers who want to program Welle in C language. It contains basic api to interact with Welle. The framework of this api is almost the same with the one in Javascript.

#### Folder Outline

- src
  Folder that contains source code of api implementation (C language)
- example.c
  One example for reading filtered **Position Data** from Welle
- Makefile
  Make the example program with ```make```

#### Example

##### Connectivity

```C
// Port configuration
int baud = 115200; // Set baudrate to 115200
printf("Set baudrate to %d\n", baud);
char *portname = "/dev/tty.usbmodem1421"; // Change the portname accordingly
int fd = wsOpen(portname);
```

##### Initialization & Configuration

``` C
// Initialize basic commands to configure data output
wcInitlaizeBasicCmds();
// Initialize data decoder
wdInitializeDecoder();
// Configure data output
configDataOutput(fd)
```

##### Read/Write

```c
// Start data flow
startDataFlow(fd);
// Read & decode data flow
readDataFlow(fd);
```

There's no ```stopDataFlow``` command right now. To stop the data flow, please simply type ```ctrl_c```.

#### Usage

For developers who want to integrate the API with their own programs, please take a look at the file ```welleDecoder.c```.

In the comment block, you can call ```envData.data```, ```peakData.data```, ```peakData_f.data```, ```posData.data```, or ```posData_f.data``` to get the output data. Each of the data is array type, so be sure you get the right data for your program.

#### TODO

In the future version of C API, I will improve the code for

- *configDataOutput*: Add more arguments to read different data.
- *readDataFlow*: Add more arguments to specify the targeted output data.
- *stopDataFlow*