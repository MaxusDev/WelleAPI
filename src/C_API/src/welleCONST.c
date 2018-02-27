#include "welleCONST.h"

void wcInitlaizeBasicCmds()
{
    wcConfigAllData.msgType = "configAllData";
    wcConfigAllData.cmdLength = 12;
    wcConfigAllData.rspLength = 14;
    wcConfigAllData.cmd = (char *)malloc(sizeof(char) * wcConfigAllData.cmdLength);
    wcConfigAllData.rsp = (char *)malloc(sizeof(char) * wcConfigAllData.rspLength);
    memcpy(wcConfigAllData.cmd, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x00, 0x06, 0x30, 0x01, 0x40, 0x3f}), 12);
    memcpy(wcConfigAllData.rsp, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x08, 0x00, 0x02, 0x30, 0x3f, 0x40, 0x00, 0x00}), 14);

    wcConfigPosData_f.msgType = "configPosDataFiltered";
    wcConfigPosData_f.cmdLength = 12;
    wcConfigPosData_f.rspLength = 14;
    wcConfigPosData_f.cmd = (char *)malloc(sizeof(char) * wcConfigPosData_f.cmdLength);
    wcConfigPosData_f.rsp = (char *)malloc(sizeof(char) * wcConfigPosData_f.rspLength);
    memcpy(wcConfigPosData_f.cmd, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x00, 0x06, 0x30, 0x01, 0x40, 0x10}), 12);
    memcpy(wcConfigPosData_f.rsp, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x08, 0x00, 0x02, 0x30, 0x10, 0x40, 0x00, 0x00}), 14);

    wcStartDataFlow.msgType = "startDataFlow";
    wcStartDataFlow.cmdLength = 12;
    wcStartDataFlow.rspLength = 14;
    wcStartDataFlow.cmd = (char *)malloc(sizeof(char) * wcStartDataFlow.cmdLength);
    wcStartDataFlow.rsp = (char *)malloc(sizeof(char) * wcStartDataFlow.rspLength);
    memcpy(wcStartDataFlow.cmd, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x00, 0x06, 0x30, 0x01, 0x10, 0x00}), 12);
    memcpy(wcStartDataFlow.rsp, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x08, 0x00, 0x02, 0x30, 0x00, 0x10, 0x00, 0x00}), 12);

    wcStopDataFlow.msgType = "stopDataFlow";
    wcStopDataFlow.cmdLength = 12;
    wcStopDataFlow.rspLength = 14;
    wcStopDataFlow.cmd = (char *)malloc(sizeof(char) * wcStopDataFlow.cmdLength);
    wcStopDataFlow.rsp = (char *)malloc(sizeof(char) * wcStopDataFlow.rspLength);
    memcpy(wcStopDataFlow.cmd, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x00, 0x06, 0x30, 0x01, 0x20, 0x00}), 12);
    memcpy(wcStopDataFlow.rsp, ((char []){0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x08, 0x00, 0x02, 0x30, 0x00, 0x20, 0x00, 0x00}), 12);
}
