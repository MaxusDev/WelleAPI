#include "welleAPI.h"

int configDataOutput(int fd)
{
    return wsWriteAndResp(fd, wcConfigPosData_f, sizeof(wcConfigPosData_f.cmd));
    // return wsWriteAndResp(fd, wcConfigAllData, sizeof(wcConfigAllData.cmd));
}

int startDataFlow(int fd)
{
    return wsWriteAndResp(fd, wcStartDataFlow, sizeof(wcStartDataFlow.cmd));
}

int readDataFlow(int fd)
{
    char buf[1] = {0};
    // buf = (char *)malloc(sizeof(char));
    while(1)
    {
        wdDecode(fd, buf);
		
		/*
		  Your code here:
		  You can play with following data according to your configuration.
		  - Envelop data
		  - Peak data (filtered)
		  - Position data (filtered)
		  Raw data will be supported in next version of the API.
		*/
    }

}
