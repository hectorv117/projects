#include <stdint.h>
#include <stdio.h>
#include <string.h>
# include <arpa/inet.h>
// 5 types of packets: ACK, DATA, RRQ, WRQ, ERROR
typedef enum {
    RRQ = 1,
    WRQ = 2,
    DATA = 3,
    ACK = 4,
    ERROR = 5,
} TTFTP_OPCODE;


typedef struct ack {
    TTFTP_OPCODE opcode;
    uint16_t block_number;
} __attribute__((packed)) TTFTP_ACK;

typedef struct data {
    TTFTP_OPCODE opcode;
    uint16_t block;
    uint8_t data[512];
} __attribute__((packed)) TTFTP_DATA;

typedef struct rq {
    TTFTP_OPCODE opcode;
    char *filename;
    char *mode;
} __attribute__((packed)) TTFTP_RQ;


int serialize(void *packet, uint8_t *buf, size_t packet_size){
    uint16_t *opcode = (uint16_t*)packet;
    if (*opcode == htons(ACK)){
        packet = (TTFTP_ACK*)packet;
    }
    else if ( *opcode == htons(DATA)){
        packet = (TTFTP_DATA*)packet;
    }
    else if ( *opcode == htons(RRQ) || *opcode == htons(WRQ)){
        packet = (TTFTP_RQ*)packet;
    }
    else{
        fprintf(stderr, "Wasn't able to find a valid opcode");
        return 1;
    }

    uint8_t *first_byte = (uint8_t*)packet;
    printf("first byte: %u\n", *first_byte);

    int offset;
    for (int i=0; i<packet_size; i++){
        offset = i;
        printf("%02x ", *first_byte);
        memcpy(buf+offset, first_byte++, 1);
    }
    printf("\nfinished serializing packet!\n");
    return 0;
}

void print_binary_data_buf(uint8_t *buf, size_t size){
    for (int i = 0; i<size; i++){
        printf("%02x ", *(buf+i));
    }
    printf("\n");
}