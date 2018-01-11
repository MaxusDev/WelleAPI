## Welle_Protocol_Dev_0.7.0

[TOC]

***
### 1. Message Flowchart

```sequence
Note left of HOST: GET
HOST->WELLE: GET Request
WELLE->HOST:  GET Response with status and data
Note left of HOST: SET
HOST->WELLE: SET Request
WELLE->HOST:  SET Response with status
Note left of HOST: DATAFLOW CONFIG
HOST->WELLE: DATAFLOW CONFIG Request
WELLE->HOST:  DATAFLOW CONFIG Response with status
Note left of HOST: DATAFLOW START
HOST->WELLE: DATAFLOW START Request
WELLE->HOST: DATAFLOW START Response with status and data
WELLE->HOST: DATAFLOW Response continuously
Note left of HOST: DATAFLOW STOP
HOST->WELLE: DATAFLOW STOP Request
WELLE->HOST:  DATAFLOW STOP Response with status
Note left of HOST: SYSCMD
HOST->WELLE: SYSCMD Request
WELLE->HOST:  SYSCMD Response with status
Note left of HOST: Notification
WELLE->HOST:  Notification Response 
```



---



###  2. Welle Message

As we can see from the above flow chart, welle messages are divided into two types, ***Request*** and ***Response***.

There are six types of ***Request*** that host can make:

> - GET
> - SET
> - DATAFLOW CONFIG
> - DATAFLOW START
> - DATAFLOW STOP
> - SYSCMD

There are seven types of ***Response*** that host can make:

> - GET Response
> - SET  Response
> - DATAFLOW CONFIG Response
> - DATAFLOW START Response
> - DATAFLOW STOP Response
> - SYSCMD Response
> - NOTIFICATION Response





#### 2.1 Structure of Message

##### Request Message Structure

|     Header      | Length |  Type  | Param  | Body |
| :-------------: | :----: | :----: | :----: | :--: |
| '######' 6bytes | 2bytes | 2bytes | 2bytes | Vary |

##### Response Message Structure

|     Header     | Length |  Type  | Param  | Status | Body |
| :------------: | :----: | :----: | :----: | :----: | :--: |
| '######'6bytes | 2bytes | 2bytes | 2bytes | 2bytes | Vary |



#### 2.2 Message Field Parse

##### 2.2.1 Message Header

- All messages start with '######' regardless of request or response data

##### 2.2.2 Message Length

- Total message length in bytes excludes message header

##### 2.2.3 Message Type

-  The message type in  Request and Response should be in its corresponding pair. Cooreponding field defined as follow
```C
enum MSG_TYPE {
	// Get and Get command response
	wGET = 0x1001,
	wGET_RESP = 0x1002,
	// Set and Set command response
	wSET = 0x2001,
	wSET_RESP = 0x2002,
	// Dataflow command and response
	wDATAFLOW = 0x3001,
	wDATAFLOW_RESP = 0x3002,
	// System command and response
	wSYSCMD = 0x4001,
	wSYSCMD_RESP = 0x4002,
	// Notification for Async Data: Battery, Gesture
	wNotification = 0x5001,
};
```

##### 2.2.4 Message Param

Different type of message has different parameter set.

- GET/SET Message Param

```C
enum SYSTEM_PARA {  
//---------------------GET parameters----------------
	wDEVICE_INFO = 0x0200,
//---------------------SET parameters----------------
    // Gesture result Output Control
    // Default on for BLE, default off for USB
	wGESTURE_RESULT = 0x0021,                  
	
	// LEDs
	wLED_1 = 0xFF01,
	wLED_2 = 0xFF02
};
```

- DATAFLOW Param

Check bitwise to filter out DATAFLOW parameters. Note that the DataFlow message is further classified into three types, DataFlow **START**, DataFlow **STOP**, DataFlow **CONFIG**. 

| Parm field | Description                              |
| ---------- | ---------------------------------------- |
| bit-15     | Reserved                                 |
| bit-12~14  | 001: start dataflow message; 010: stop dataflow message; 100: config dataflow  message |
| bit-6~11   | Reserved                                 |
| bit-5      | set 1 to enable envelop output; 0 to disable envelop output |
| bit-4      | set 1 to enable filtered position output; 0 to disable filtered position output |
| bit-3      | set 1 to enable raw position output; 0 to disable raw position output |
| bit-2      | set 1 to enable filtered peak index output; 0 to disable filtered peak index output |
| bit-1      | set 1 to enable raw peak index output; 0 to disable raw peak index output |
| bit-0      | set 1 to enable raw signal output; 0 to disable raw signal output |

Corresponding data structure.

```C
enum DATAFLOW_PARA {
	//dataflow control byte
	wSTART = 0x1000,
	wSTOP = 0x2000,
	wCONFIG = 0x4000,
	//dataflow output type bytes
	wRAW = 0x0001,
	wPEAK_RAW = 0x0002,
	wPEAK_FILTERED = 0x0004,
	wPOSITION_RAW = 0x0008,
	wPOSITION_FILTERED = 0x0010,
	wENVELOP = 0x0020,
	wOUTPUT_USB_DEFAULT = wRAW | wPEAK_RAW | wPEAK_FILTERED | wPOSITION_RAW | wPOSITION_FILTERED | wENVELOP,
	wOUTPUT_BLE_DEFAULT = wPOSITION_FILTERED 
};
```

- SYSCMD Param

| Parm field | Description                              |
| ---------- | ---------------------------------------- |
| bit-4~15   | Reserved                                 |
| bit-3      | set 1 to recalibrate system              |
| bit-2      | set 1 to restart the system              |
| bit-1      | set 1 to reset system to boot in normal mode |
| bit-0      | set 1 to reset system to boot in bootloader mode |

Corresponding data structure. **Note that** *the wRESET_BOOT/wRESET_APP/wRESTART is only allowed to be used for firmware upgrade purpose. Developers should not misuse these function. System will be broken down, otherwise.*

```C
enum SYSCMD_PARA {
	wRESET_BOOT = 0x0001,  // only used in firmware upgrade
	wRESET_APP = 0x0002,   // only used in firmware upgrade
	wRESTART = 0x0004,     // only used in firmware upgrade
	wRECAL = 0x0008
};
```

- NOTIFICATION PARAM

These two params indicate whether the notification is generated by gesture performed or charging status changed.

| Parm field | Description                              |
| ---------- | ---------------------------------------- |
| bit-2~15   | Reserved                                 |
| bit-1      | 1: indicates message contains battery info |
| bit-0      | 1: indicates message contains gesture info |

Corresponding data structure.

```C
enum NOTIFICATION_PARA {
	wBATTERY = 0x0001,
	wGESTURE = 0x0002
};
```



##### 2.2.5 Message Status
Only contained in Response and Notification message，indicating the status of the prior request
```C
enum WELLE_STATUS{
	//Succes
	wSUCCESS = 0x0000,
	// General error
	wERR = 0x0001, 
	//Parameter invalid
	wERR_INVALID_PARAMETER = 0x0002,
	//A provided parameter value was out of its allowed range.
	wERR_OUT_OF_RANGE = 0x0003, 	
	//Read only parameter
	wERR_READONLY_PARAMETER = 0x0004,
	//Invalid Datalength
	wERR_INVALID_DATALENGTH = 0x0005
};
```



#### 2.3 Message Example

All data presented will be in HEX view.

##### 2.3.1 GET/SET Req/Resp Message

- Get device info message

 `0x232323232323` `0x0006` `0x1001` `0x0200`

|  Header  | Length | Type |    Param     |
| :------: | :----: | :--: | :----------: |
| '######' |   6    | wGET | wDEVICE_INFO |
- Get device info response

In the example case, 

`0x232323232323` `0x0016` `0x1002` `0x0200` `0x0000` `0x004D004B` `0x312E3030` `0x0164` `0xFF01`  `0x2222`

**Note that** you may get reversed bytes for Welle is little endian while serial transfer is big endian. Such as, 

`0x232323232323` `0x1600` `0x0210` `0x0002` `0x0000` `0x4D004B00` `0x2E313030` `0x6410` `0x01FF`  `0x2222`

Make sure you handle this reversed bytes correctly. 

|  Header  | Length |   Type    |    Param     |  Status  |                   Body                   |
| :------: | :----: | :-------: | :----------: | :------: | :--------------------------------------: |
| '######' |   22   | wGET_RESP | wDEVICE_INFO | wSUCCESS | UUID(4bytes) \| Firmware_version(4bytes) \| Battery_info(2bytes) \| cur_control(2bytes) \|  shortcuts(2bytes) |
The body field contains 16 bytes in total. 

`UUID` :  Device ID, in this case, `0x004D004B`

`Firmware_version` : device version, in this case version is 1.00 in Ascii, `0x312E3030` in hex.

`Battery_info` : The first byte indicates the charging states: `0x00` not charging, `0x01` charging. The second 		byte indicates the percentage of  power level, in this case `0x64` is 100%

`cur_control` : Welle has tow predefined controll states, which can be allocated to two connected smart device through welleApp. Two LEDs are used to indicate thses states, Green and Blue. The first bytes is reserved to `0xFF`. The second bytes `0x01` corresponds to Green and `0x02` corresponds to Blue

`shortcuts` : A **Hold** gesture is predefined for switching between the above two controlling states. `0x2222` is fixed for this field.



##### 2.3.2 Dataflow Request Message 

Welle can output several types of data, such as, raw echo signal, peak of raw echo, raw position (calculated coordinates without smoothing), filtered position, (coordinates with smoothing), the echo signal envelop. By default, welle output all the above data when connected to usb host, while only filtered position is output when connected to BLE for its speed limitation.

```C
wRAW = 0x0001,
wPEAK_RAW = 0x0002,
wPEAK_FILTERED = 0x0004,
wPOSITION_RAW = 0x0008,
wPOSITION_FILTERED = 0x0010,
wENVELOP = 0x0020,
wOUTPUT_USB_DEFAULT = wRAW | wPEAK_RAW | wPEAK_FILTERED | wPOSITION_RAW | wPOSITION_FILTERED |wENVELOP,
wOUTPUT_BLE_DEFAULT = wPOSITION_FILTERED 
```

User can config their interested part of data to output following the next few steps.

- **Configuration**

Configure Dataflow to output **RAW signal** and **POSITION_FILTERED coordinate** via **USB**.

`0x232323232323` `0006` `3001` `4011`

|  Header  | Length |   Type    |                 Param                 | Body |
| :------: | :----: | :-------: | :-----------------------------------: | :--: |
| '######' |   6    | wDATAFLOW | wCONFIG \| wRAW \| wPOSITION_FILTERED | None |

- **Start Dataflow**

By default welle will not output any data unless DataFlow START cmd is received.

`0x232323232323` `0006` `3001` `1000`

|  Header  | Length |   Type    | Param  | Body |
| :------: | :----: | :-------: | :----: | :--: |
| '######' |   6    | wDATAFLOW | wSTART | None |
-  **Stop Dataflow**

`0x232323232323` `0006` `3001` `2000`

|  Header  | Length |   Type    | Param | Body |
| :------: | :----: | :-------: | :---: | :--: |
| '######' |   6    | wDATAFLOW | wSTOP | None |


##### 2.3.3 Dataflow Response Message
The  Body of the response message are consists of 2 bytes, the data type is int16.



|  Header  | Length |      Type      |                  Param                   | Status  | Body |
| :------: | :----: | :------------: | :--------------------------------------: | :-----: | :--: |
| '######' | 2bytes | wDATAFLOW_RESP | wRAW \|wPEAK_RAW\| wPEAK_FILTERED\|wPOSITION_FILTERED\|wPOSITION_FILTERED\|wENVELOP | wSUCCES | Vary |

Data Type Format:(**Please Check Param Flag in the Following Order**)

| DATA TYPE          | FORMAT | LENGTH            | Notes                                    |
| ------------------ | ------ | ----------------- | ---------------------------------------- |
| wRAW               | uint16 | 2 channels * 1360 | 2 channel's raw signal, each has 1360 points value range [0~4095] |
| wENVELOP           | int16  | 2 channels * 600  | 2 channel's signal envelop, each has 600 points |
| wPEAK_RAW          | int16  | 2                 | 2 channels' raw echo position            |
| wPEAK_FILTERED     | int16  | 2                 | 2 channels' filtered echo position       |
| wPOSITION_RAW      | int16  | 3                 | raw target position[x,y,z(currently unused)] in mm |
| wPOSITION_FILTERED | int16  | 3                 | iltered target position[x,y,z(currently unused)] in mm |



##### 2.3.4 SYSTEM Message

- **Recal CMD**

You may want to recalibrate welle if it doesn't output smooth data or doesn't work well in recognizing gesture. Note that welle need a relatively big clean surface for better performance. Green LED will blink 3 times if recal succeeds. Or it will be stucked in Blue blink. Transfer welle to a more clean surface and the recal procedure will continue and Green LED blinks. 

`0x232323232323` `0006` `4001` `0008` 



|  Header  | Length |  Type   | Param  | Body |
| :------: | :----: | :-----: | :----: | :--: |
| '######' |   6    | wSYSCMD | wRECAL | None |

- **Other CMD**

**Cautions !!!**  The following three parameter is used when welle needs firmware upgrade. User **MUST** not issue these system cmd. 

```
wRESET_BOOT = 0x0001,
wRESET_APP = 0x0002,
wRESTART = 0x0004,
```

`wRESET_BOOT` : when this parameter is set, sys cmd tells welle to enter boatload mode.

`wRESET_APP`: when this parameter is set, sys cmd tells welle to boot to normal mode.

`wRESTART`: when this parameter is set, sys cmd tells welle to reboot.



##### 2.3.5 NOTIFICATION Message

Notification message is **asynchronous message** initiated by Welle once a certain conditions are met.
For example: 

1. When a gesture is performed, the resulting gesture output will be sent by **NOTIFICATION** Message to the host.
2. When Welle charging status is changed, a battery **NOTIFICATION** message will be triggered.

**Predefined Gesture Code**

```c
enum WELLE_GESTURE {
	wUNKNOWN = 0x00FE,
	wLEFT_RIGHT = 0x0001,
	wRIGHT_LEFT = 0x0002,
	wUP_DOWN = 0x0003,
	wDOWN_UP = 0x0004,
	wCLOCKWISE = 0x0005,
	wANTI_CLOCKWISE = 0x0006,
	wHOLD = 0x0022
};
```



Before we can get any gesture notification message, a SET CMD is need to trigger the gesture output.

- **SET GestureOn**

`0x232323232323` `0x000A` `0x2001` `0x0021` `0x3f800000`



|  Header  | Length | Type |      Param      |   Body    |
| :------: | :----: | :--: | :-------------: | :-------: |
| '######' |   10   | SET  | wGESTURE_RESULT | GestureOn |

**Note**, `3f800000` is a hex value which translated from a float32 value 1.0 indicating GestureOn.



- **Notification with gesture**

`0x232323232323` `0x000C` `0x5001` `0x0002` `0x0000` `0x0003` `0xFF01`



|  Header  | Length |     Type      |  Param   | Status  | Body                            |
| :------: | :----: | :-----------: | :------: | :-----: | ------------------------------- |
| '######' |   12   | wNotification | wGESTURE | wSUCCES | wUP_DOWN \| wLED_1(current LED) |



- **Battery Status Notification**

`0x232323232323` `0x000A` `0x5001` `0x0203` `0x0000` `0x0164`



|  Header  | Length |     Type      |  Param   | Status  | Body                |
| :------: | :----: | :-----------: | :------: | :-----: | ------------------- |
| '######' |   10   | wNotification | wBATTERY | wSUCCES | wCHARGING \|\| 100% |



---



### 3. How to get data from Welle

Welle provide many type of data for user to play with. 

You can get data from welle via usb by, first cofiguring dataflow to enable the insterested type of data, starting dataflow, and then stoping dataflow at the end.

You can also recalibrate the system if you think welle is not working well.

- **Configure Dataflow** 

  configure dataflow to output POSITION_FILTERED coordinate via USB.

> **Request**: `0x232323232323` `0006` `3001` `4010`


|  Header  | Length |   Type    |             Param             | Body |
| :------: | :----: | :-------: | :---------------------------: | :--: |
| '######' |   6    | wDATAFLOW | wCONFIG \| wPOSITION_FILTERED | None |


> **Response**: `0x232323232323` `0008` `3002` `4010` `0000`


|  Header  | Length |      Type      |             Param              | Status  | Body |
| :------: | :----: | :------------: | :----------------------------: | :-----: | :--: |
| '######' |   8    | wDATAFLOW_RESP | wCONFIG  \| wPOSITION_FILTERED | wSUCCES | None |

- **Dataflow Start**

> **Request**: `0x232323232323` `0006` `3001` `1000` 


|  Header  | Length |   Type    | Param  | Body |
| :------: | :----: | :-------: | :----: | :--: |
| '######' |   6    | wDATAFLOW | wSTART | None |



> **Response**:  `0x232323232323` `000E` `3002` `1210` `0000` `FFDC` `FF55` `0023` 


|  Header  | Length |      Type      |            Param             | Status  |        Body        |
| :------: | :----: | :------------: | :--------------------------: | :-----: | :----------------: |
| '######' |   14   | wDATAFLOW_RESP | wSTART \| wPOSITION_FILTERED | wSUCCES | coordinates[x,y,z] |

The response body will contain three int16 data representing the filtered coordinates (x,y,z) in mm.

In this case, (`FFDC` `FF55` `0023`) is (x y z) .

\* z is a fixed value`0023` reserved for later use.

- **Dataflow Stop**

A Good practice is to stop dataflow when your program exits. This make sure Welle won't send dataflow continuously even if host is not ready to receive data. 

> **Request**: `0x232323232323` `0006` `3001` `2000`


|  Header  | Length |   Type    | Param | Body |
| :------: | :----: | :-------: | :---: | :--: |
| '######' |   6    | wDATAFLOW | wSTOP | None |



> **Response**: `0x232323232323` `0008` `3002` `2000` `0000`


|  Header  | Length |      Type      | Param | Status  | Body |
| :------: | :----: | :------------: | :---: | :-----: | :--: |
| '######' |   8    | wDATAFLOW_RESP | wSTOP | wSUCCES | None |

- **Recalibration**

> **Request**: `0x232323232323` `0006` `4001` `0008` 



|  Header  | Length |  Type   | Param  | Body |
| :------: | :----: | :-----: | :----: | :--: |
| '######' |   6    | wSYSCMD | wRECAL | None |



> **Response**: `0x232323232323` `0008` `4002` `0008` `0000`



|  Header  | Length |  Type   | Param  | Status  | Body |
| :------: | :----: | :-----: | :----: | :-----: | :--: |
| '######' |   8    | wSYSCMD | wRECAL | wSUCCES | None |



---



### 4. Welle with BLE
Welle supports BLE data transfer, however due to the speed limitation of BLE, only a few of the command work on BLE mode.

#### Welle BLE info

- **BLE Device Name**
  - Welle-xxxxxxxx
- **BLE Characteristics Write**
  - Service UUID: FFE5
  - Characteristics UUID: FFE9
- **BLE Characteristics Read/Notify**
  - Service UUID: FFE0
  - Characteristics UUID: FFE4
    Write '1' to this Characteristics to enable notification

#### Command over BLE
The protocol is simplified in BLE data communication, Welle only responses to the following commands sent over BLE. 

1. **DATAFLOW CONFIG** as output **POSITION_FILTERED** over BLE
2. **DATAFLOW START** and **DATAFLOW STOP**
3. **SYSCMD RECAL**
4. **NOTIFICATION** message
5. **GET** / **SET** for a certain commands

Configure Dataflow to output **POSITION_FILTERED coordinate** only via **BLE**.

The most of the steps are the same except for **Dataflow Start Response**. BLE transmission speed is slow so the Dataflow Start Response structure is reduced.

Once BLE is connected you do not need to specify  output data type, since BLE can only output **FILTERED COORDINATE**.

**Dataflow Start**
> **Request**: `0x232323232323` `0006` `3001` `1000` 


|  Header  | Length |   Type    | Param  | Body |
| :------: | :----: | :-------: | :----: | :--: |
| '######' |   6    | wDATAFLOW | wSTART | None |



> **Dataflow Start Response**: `0x232323232323` `0008` `3002` `1001` `0000` 


|  Header  | Length |      Type      |            Param             | Status  | Body |
| :------: | :----: | :------------: | :--------------------------: | :-----: | :--: |
| '######' | 2bytes | wDATAFLOW_RESP | wSTART \| wPOSITION_FILTERED | wSUCCES | None |




> **Data Response**:  `0x2123` `FFDC` `23` `FF55` 


| Header |    X Coor    |  #   |    Y Coor    |
| :----: | :----------: | :--: | :----------: |
|  '!#'  | 2bytes int16 |  #   | 2bytes int16 |

---
### Recommended Tools
**Serial Tools**
- Nodejs: serialport module
- Python: pyserial module
- Mac: CoolTerm 
- Windows: putty

**BLE Tools**
- iOS/Mac: LightBlue
- Nodejs: noble module
- Python: pybluez module

### Contact
Email: developer@maxustech.com tom.zheng@maxustech.com






