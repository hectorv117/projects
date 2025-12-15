#include <stdint.h>
#include <stdio.h>
#include "packets.h"



int main(int arc, char **argv){

    TTFTP_ACK test_ack = {
        .opcode = htons(ACK),
        .block_number = 0
    };

    TTFTP_RQ test_rq = {
        .opcode = htons(RRQ),
    };

    size_t psize = sizeof(test_rq);
    uint8_t buf[1024];

    // int res = serialize(&test_rq, buf, psize);

    // printf("buf after serializing: ");
    // print_binary_data_buf(buf, psize);

    printf("no serializing: ");
    print_binary_data_buf((uint8_t*)&test_rq, psize);
    
    return 0;
}