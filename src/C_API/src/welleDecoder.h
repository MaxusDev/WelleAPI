#include "welleCONST.h"

#define STATE_UNKNOW        -1
#define STATE_HEADER        1
#define STATE_DATALENGTH    2
#define STATE_MESSAGE       3
#define STATE_DATAFLOW      4
#define DATA_HEADER         0x23
#define DATA_HEADER_LENGTH  6
#define DATAFLOW_LENGTH     5
#define DATATYPES           6

#ifndef __WELLEDECODER_H__
#define __WELLEDECODER_H__

typedef struct WELLEDECODER
{
    int decodeState;
    int headerCount;
    int byteCount;
    int msgLength;
    char *dataBuffer;
    char *prevByte;
    char *messageBuffer;

} welleDecoder_t;

typedef struct AVAILABLEDATA
{
    int flag;
    int dataLength;
    int *data;
} availableData_t;

welleDecoder_t wdDecoder;
availableData_t rawData;
availableData_t envData;
availableData_t peakData;
availableData_t peakData_f;
availableData_t posData;
availableData_t posData_f;

extern void wdInitializeDecoder();
extern void wdDecode(int fd, char *buf);
extern void wdDecodeHeader(char *data);
extern void wdDecodeDataLength(char *data);
extern void wdDecodeDataMessage(char *data);
extern int wdDecodePackBodyMessage(char *data);
// extern void wdPackRequestData();
extern void wdReverseBuffer(char *data, char *dataCpy);
extern int wdConv2Int16(char *data, int index);
extern void wdResetDecoder();

#endif

