#include "welleSerial.h"

typedef struct WELLESERIAL
{
    // welleDecoder *decoder;
    void (*msgCallback)();
    int debug;
} welleSerial;

int wsConfig (int fd, int speed)
{
    struct termios tty;
    memset (&tty, 0, sizeof tty);
    if (tcgetattr (fd, &tty) != 0)
    {
        printf("error %d from tcgetattr", errno);
        return -1;
    }

    cfsetospeed (&tty, speed);
    cfsetispeed (&tty, speed);

    tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;     // 8-bit chars
    // disable IGNBRK for mismatched speed tests; otherwise receive break
    // as \000 chars
    tty.c_iflag &= ~IGNBRK;     // disable break processing
    tty.c_lflag = 0;            // no signaling chars, no echo,
                                // no canonical processing
    tty.c_oflag = 0;            // no remapping, no delays
    tty.c_cc[VMIN]  = 0;        // read doesn't block
    tty.c_cc[VTIME] = 5;        // 0.5 seconds read timeout

    tty.c_iflag &= ~(IXON | IXOFF | IXANY); // shut off xon/xoff ctrl

    tty.c_cflag |= (CLOCAL | CREAD);        // ignore modem controls,
                                            // enable reading
    tty.c_cflag &= ~(PARENB | PARODD);      // shut off parity
    tty.c_cflag |= 0; // parity = 0
    tty.c_cflag &= ~CSTOPB;
    tty.c_cflag &= ~CRTSCTS;

    if (tcsetattr (fd, TCSANOW, &tty) != 0)
    {
        printf("error %d from tcsetattr", errno);
        return -1;
    }
    return 0;
}

// Set UART blocking

void wsSetblocking (int fd, int should_block)
{
    struct termios tty;
    memset (&tty, 0, sizeof tty);
    if (tcgetattr (fd, &tty) != 0)
    {
        printf("error %d from tggetattr", errno);
        return;
    }

    tty.c_cc[VMIN]  = should_block ? 1 : 0;
    tty.c_cc[VTIME] = 5;        // 0.5 seconds read timeout

    if (tcsetattr (fd, TCSANOW, &tty) != 0)
    {
        printf("error %d setting term attributes", errno);
    }
}

// Open a UART port

int wsOpen(char *portname)
{
    printf("Portname = %s\n", portname);
    // int fd = open (portname, O_RDWR | O_NOCTTY | O_SYNC);
    int fd = open (portname, O_RDWR | O_NOCTTY | O_NONBLOCK);
    printf("File description = %d\n", fd);
    if (fd < 0)
    {
        printf("error %d opening %s: %s", errno, portname, strerror (errno));
    }
    else {
        sleep(1);
        while(tcflush(fd, TCIFLUSH) != 0);
        printf("Port Opened, fileDescription = %d\n", fd);
    }
    return fd;
}

int wsRead(int fd, char *buffer, int bufferSize)
{
    return read(fd, buffer, bufferSize);
}

int wsWriteAndResp(int fd, command_t command, int commandSize)
{
    int rspState = -1;
    printf("Write %s request\n", command.msgType);
    while(rspState != 0)
    {
        write(fd, command.cmd, command.cmdLength);
        // if debug then print
        sleep(1);
        rspState = wsCheckResp(fd, command.rsp, command.rspLength);
        // Check response, return 0 if response is right
    }

    return rspState;
}

int wsFlush(int fd)
{
    sleep(1);
    tcflush(fd,TCIOFLUSH);
    return 0;
}

int wsCheckResp(int fd, char *targetResponse, int rspLength)
{
    int readNum = -1;
    char *buf;
    buf = (char *)malloc(sizeof(char) * rspLength);
    while(readNum < 0)
    {
        readNum = wsRead(fd, buf, rspLength);
    }
    // if debug
    printf("Response: ");
    for (int i = 0; i < rspLength; ++i)
    {
        printf("%x ", buf[i]);
    }
    printf("\n");
    return memcmp(buf, targetResponse, rspLength);
}


