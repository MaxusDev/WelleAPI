#include "welleAPI.h"

int main(int argc, char const *argv[])
{

    // Port configuration
    int baud = 115200;
    printf("Set baudrate to %d\n", baud);
    char *portname = "/dev/tty.usbmodem1421";
    int fd = wsOpen(portname);
    if(!wsConfig(fd, baud))
    {

        wcInitlaizeBasicCmds();
        wdInitializeDecoder();

        // Config Data, return 0 when success
        configDataOutput(fd);

        // Config Data, return 0 when success
        startDataFlow(fd);

        // Decode data
        readDataFlow(fd);

    }
    return 0;
}
