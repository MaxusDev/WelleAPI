#include "welleCONST.h"

#ifdef __APPLE__
#include <CoreFoundation/CoreFoundation.h>
#include <IOKit/IOKitLib.h>
#include <IOKit/IOBSD.h>
#endif


#ifndef __WELLESERIAL_H__
#define __WELLESERIAL_H__

extern int wsConfig (int fd, int speed);
extern void wsSetblocking (int fd, int shouldBlock);
extern int wsOpen(char *name);
extern int wsRead(int fd, char *buffer, int bufferSize);
extern int wsWriteAndResp(int fd, command_t command, int commandSize);
extern int wsFlush(int fd);
extern int wsCheckResp(int fd, char *targetResponse, int rspLength);
#endif
