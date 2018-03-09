#include "welleDecoder.h"
#include "welleSerial.h"

void wdInitializeDecoder()
{
    wdDecoder.decodeState = STATE_HEADER;
    wdDecoder.headerCount = 0;
    wdDecoder.byteCount = 0;
    wdDecoder.msgLength = 0;
    wdDecoder.dataBuffer = (char *)malloc(sizeof(char) * 2); // Cannot make it (char *){0} nor NULL
    wdDecoder.prevByte = NULL;
    wdDecoder.messageBuffer = NULL;

    rawData.flag = wRAW;
    rawData.dataLength = 1360 * 2;
    rawData.data = (int *)malloc(rawData.dataLength * sizeof(int));

    envData.flag = wENVELOPE;
    envData.dataLength = 1200;
    envData.data = (int *)malloc(envData.dataLength * sizeof(int));

    peakData.flag = wPEAK_RAW;
    peakData.dataLength = 2;
    peakData.data = (int *)malloc(peakData.dataLength * sizeof(int));

    peakData_f.flag = wPEAK_FILTERED;
    peakData_f.dataLength = 2;
    peakData_f.data = (int *)malloc(peakData_f.dataLength * sizeof(int));

    posData.flag = wPOSITION_RAW;
    posData.dataLength = 3;
    posData.data = (int *)malloc(posData.dataLength * sizeof(int));

    posData_f.flag = wPOSITION_FILTERED;
    posData_f.dataLength = 3;
    posData_f.data = (int *)malloc(posData_f.dataLength * sizeof(int));
}

void wdDecode(int fd, char *buf)
{
    int readNum = -1;
    while(readNum < 0)
    {
        usleep(1000);
        readNum = wsRead(fd, buf, 1);
    }
    // printf("Data: %x\n", buf[0]);
    switch (wdDecoder.decodeState)
    {
        case STATE_HEADER:
            wdDecodeHeader(buf);
            break;
        case STATE_DATALENGTH:
            wdDecodeDataLength(buf);
            break;
        case STATE_MESSAGE:
            wdDecodeDataMessage(buf);
            break;
    }
}

void wdDecodeHeader(char *data)
{
    if (data[0] == DATA_HEADER)
    {
        wdDecoder.headerCount++;
        if (wdDecoder.headerCount == DATA_HEADER_LENGTH)
        {
            wdDecoder.headerCount = 0;
            free(wdDecoder.dataBuffer);
            wdDecoder.dataBuffer = (char *)malloc(sizeof(char) * 2);
            wdDecoder.decodeState = STATE_DATALENGTH;
            // printf("Decode header succeed\n");
        }

    } else {
        wdDecoder.headerCount = 0;
    }
    wdDecoder.prevByte = data;
}

void wdDecodeDataLength(char *data)
{
    wdDecoder.dataBuffer[wdDecoder.byteCount++] = data[0];
    if (wdDecoder.byteCount == 2)
    {
        // printf("%x %x\n", wdDecoder.dataBuffer[0], wdDecoder.dataBuffer[1]);
        wdDecoder.msgLength = (wdDecoder.dataBuffer[1]<<8) + wdDecoder.dataBuffer[0];
        wdDecoder.messageBuffer = (char *)malloc(sizeof(char) * wdDecoder.msgLength);
        wdDecoder.messageBuffer[0] = wdDecoder.dataBuffer[0];
        wdDecoder.messageBuffer[1] = wdDecoder.dataBuffer[1];
        wdDecoder.decodeState = STATE_MESSAGE;
        // printf("Decode data length succeed, dataLength = %d\n", wdDecoder.msgLength);
    }
}

void wdDecodeDataMessage(char *data)
{
    wdDecoder.messageBuffer[wdDecoder.byteCount++] = data[0];
    if (wdDecoder.byteCount == wdDecoder.msgLength)
    {
        char *dataCpy = (char *)malloc(sizeof(wdDecoder.messageBuffer));
        wdReverseBuffer(wdDecoder.messageBuffer, dataCpy);
        if(wdDecodePackBodyMessage(dataCpy))
        {
            printf("x: %d, y: %d\n", posData_f.data[0], posData_f.data[1]);
        }
        free(dataCpy);
        free(wdDecoder.messageBuffer);
        wdResetDecoder();
    }
}

int wdDecodePackBodyMessage(char *data)
{
    // printf("Decoding Packbody Message\n");
    int msgLength = (data[0]<<8) + data[1];
    // printf("%d %d\n", msgLength, wdDecoder.msgLength);
    if (msgLength != wdDecoder.msgLength)
    {
        return -1;
    }

    // for (int i = 0; i < msgLength; ++i)
    // {
    //     printf("%x ", data[i]);
    // }
    // printf("\n");

    int dataLength = (msgLength - 8)/2;
    int msgType = (data[2]<<8) + data[3];
    int para = (data[4]<<8) + data[5];
    // printf("%x\n", para & 0xFF);
    // int status = (data[6]<<8) + data[7];

    if (msgType == wDATAFLOW_RESP)
    {
        if (dataLength)
        {
            int dataIndex = 8;
            switch (para & 0xFF)
            {
                case wRAW:
                    for (int i = 0; i < rawData.dataLength; ++i)
                    {
                        rawData.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
                case wENVELOPE:
                    for (int i = 0; i < envData.dataLength; ++i)
                    {
                        envData.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
                case wPEAK_RAW:
                    for (int i = 0; i < peakData.dataLength; ++i)
                    {
                        peakData.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
                case wPEAK_FILTERED:
                    for (int i = 0; i < peakData_f.dataLength; ++i)
                    {
                        peakData_f.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
                case wPOSITION_RAW:
                    for (int i = 0; i < posData.dataLength; ++i)
                    {
                        posData.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
                case wPOSITION_FILTERED:
                    // printf("Get filtered position");
                    for (int i = 0; i < posData_f.dataLength; ++i)
                    {
                        posData_f.data[i] = wdConv2Int16(data, dataIndex);
                        dataIndex += 2;
                    }
                    break;
            }
            return 1;
        }
        return 0;
    }
    return -1;
}

// void wdPackRequestData()
// {

// }

void wdReverseBuffer(char *data, char *dataCpy)
{
    for (int i = 0; i < wdDecoder.byteCount; i+=2)
    {
        dataCpy[i] = data[i+1];
        dataCpy[i+1] = data[i];
    }

    // printf("Databuffer: ");
    // for (int i = 0; i < wdDecoder.byteCount; ++i)
    // {
    //     printf("%x ", dataCpy[i]);
    // }
    // printf("\nReversed buffer: ");
    // for (int i = 0; i < wdDecoder.byteCount; ++i)
    // {
    //     printf("%x ", dataCpy[i]);
    // }
}

int wdConv2Int16(char *data, int index)
{
    // printf("To convert: %x %x\n", data[index], data[index+1]);
    return (data[index]<<8) | data[index + 1];
}


void wdResetDecoder()
{
    wdDecoder.decodeState = STATE_HEADER;
    wdDecoder.headerCount = 0;
    wdDecoder.byteCount = 0;
    wdDecoder.msgLength = 0;
    free(wdDecoder.dataBuffer);
    wdDecoder.dataBuffer = (char *)malloc(sizeof(char) * 2);
    wdDecoder.prevByte = NULL;
    wdDecoder.messageBuffer = NULL;
}
