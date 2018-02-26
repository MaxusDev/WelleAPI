#include "welleSerial.h"
#include "welleDecoder.h"

#ifndef __WELLEAPI_H__
#define __WELLEAPI_H__


extern int configDataOutput(int fd);
extern int startDataFlow(int fd);
extern int readDataFlow(int fd);
#endif
