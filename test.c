#include <stdio.h>
#include "packets.h"



int main(int arc, char **argv){

    TTFTP_ACK test_ack = {
        .opcode = ACK,
        .block_number = 0
    };

    size_t psize = sizeof(test_ack);
    unsigned char buf[psize+1];
    
    int res = serialize(&test_ack, buf, psize+1);
    
    return 0;
}