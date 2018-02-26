#pragma once

#include <errno.h>
#include <termios.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <string.h>

#ifndef __WELLECONST_H__
#define __WELLECONST_H__


// MSG_TYPE
#define wGET 0x1001
#define wGET_RESP 0x1002
#define wSET 0x2001
#define wSET_RESP 0x2002
#define wDATAFLOW 0x3001
#define wDATAFLOW_RESP 0x3002
#define wSYSCMD 0x4001
#define wSYSCMD_RESP 0x4002
#define wNOTIFICATION 0x5001
#define wRESERVED 0xFFF1
#define wRESERVED_RESP 0xFFF

// SYSTEM_PARA
#define wREFRESH_RATE 0x0001
#define wPOWER_STABLE_LENGTH 0x0002
#define wPOWER_STABLE_VAR 0x0003
#define wPEAK_STABLE_LENGTH 0x0004
#define wPEAK_STABLE_VAR 0x0005
#define wKALMAN_1D_CV 0x0006
#define wKALMAN_1D_CA 0x0007
#define wKALMAN_2D_CV 0x0008
#define wKALMAN_2D_CA 0x0009
#define wKALMAN_1D_P_VAR 0x0010
#define wKALMAN_1D_Q_VAR 0x0011
#define wKALMAN_2D_P_VAR 0x0012
#define wKALMAN_2D_Q_VAR 0x0013
#define wCHIDISTGAMMA 0x001
#define wTRACKER_STATE_FRAMES 0x0015
#define wAVERAGE_FILTER_SIZE 0x001
#define wTHRESHOLD 0x0017
#define wXYZ_STABLE_SIZE 0x0019
#define wXYZ_STABLE_VAR 0x0020
#define wRECOGNIZING 0x0021
#define wBLE_CONNECTION_INTERVAL 0x0100
#define wBLE_ADV_INTERVAL 0x0101
#define wBLE_RESET 0x0102
#define wLED_1 0xFF01
#define wLED_2 0xFF02
#define wLED_ALL 0xFF03
#define wDEVICE_INFO 0x020

// SYSCMD_PARA

#define wRESET_BOOT 0x0001
#define wRESET_APP 0x0002
#define wRESTART 0x0004
#define wRECAL 0x000

// DATAFLOW_PARA
#define wSTART 0x1000
#define wSTOP 0x2000
#define wCONFIG 0x4000
#define wOUTPUT_BLE 0x0100
#define wOUTPUT_USB 0x0200
#define wPEAK_RAW 0x0002
#define wPEAK_FILTERED 0x0004
#define wPOSITION_RAW 0x0008
#define wPOSITION_FILTERED 0x0010
#define wENVELOPE 0x0020
#define wRAW 0x000

// NOTIFICATION_PARA
#define wBATTERY 0x0001
#define wGESTURE 0x0002

// STATUS
#define wSUCCESS 0x0000,
#define wERR 0x0001, // General error
#define wERR_INVALID_PARAMETER 0x0002,
#define wERR_OUT_OF_RANGE 0x0002,   //A provided parameter value was out of its allowed range.
#define wERR_READONLY_PARAMETER 0x0003,     //General Welle error.
#define wERR_INVALID_DATALENGTH 0x0004      //Invalid Datalength


// WELLE_GESTURE
#define wNONE 0xFF
#define wUNKNOWN 0xFE
#define wLEFT_RIGHT 0x01
#define wRIGHT_LEFT 0x02
#define wUP_DOWN 0x03
#define wDOWN_UP 0x04
#define wCLOCKWISE 0x05
#define wANTI_CLOCKWISE 0x06
#define wA 0x07
#define wB 0x08
#define wC 0x09
#define wD 0x0A
#define wE 0x0B
#define wF 0x0C
#define wG 0x0D
#define wH 0x0E
#define wI 0x0F
#define wJ 0x10
#define wK 0x11
#define wL 0x12
#define wM 0x13
#define wN 0x14
#define wO 0x15
#define wP 0x16
#define wQ 0x17
#define wR 0x18
#define wS 0x19
#define wT 0x1A
#define wU 0x1B
#define wV 0x1C
#define wW 0x1D
#define wX 0x1E
#define wY 0x1F
#define wZ 0x20
#define wINVL 0x21
#define wHOLD 0x22

// BATTERY_STATUS
#define wNOTCHARGING 0x00
#define wCHARGING 0x01

// LED_MODE
#define wLED_OFF 0x00
#define wLED_ON 0x01
#define wLED_FLICK_SLOW 0x02
#define wLED_FLICK_FAST 0x03

// BLE_INTERVAL
#define w20MS 0x00
#define w30MS 0x01
#define w50MS 0x02
#define w100MS 0x03
#define w200MS 0x04
#define w300MS 0x05
#define w400MS 0x06
#define w500MS 0x07
#define w1000MS 0x08
#define w1500MS 0x09
#define w2000MS 0x0A
#define w2500MS 0x0B
#define w3000MS 0x0C
#define w4000MS 0x0D
#define w5000MS 0x0E
#endif

typedef struct COMMAND
{
    char *msgType;

    char *cmd;
    int cmdLength;

    char *rsp;
    int rspLength;
} command_t;

command_t wcConfigAllData;
command_t wcStartDataFlow;
command_t wcStopDataFlow;
command_t wcConfigPosData_f;

extern void wcInitlaizeBasicCmds();
