#include <arpa/inet.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const char* SANITY_STR = "Server, are you there?";


// 5 types of packets: ACK, DATA, RRQ, WRQ, ERROR
typedef enum {
  RRQ = 1,
  WRQ = 2,
  DATA = 3,
  ACK = 4,
  ERROR = 5,
} TTFTP_OPCODE;

const char *opcode_to_string(TTFTP_OPCODE opcode) {
  switch (opcode) {
  case RRQ:
    return "RRQ";
  case WRQ:
    return "WRQ";
  case DATA:
    return "DATA";
  case ACK:
    return "ACK";
  case ERROR:
    return "ERROR";
  default:
    return "UNKNOWN";
  }
}

typedef struct ack {
  uint16_t opcode;
  uint16_t block_number;
} __attribute__((packed)) TTFTP_ACK;

typedef struct data {
  uint16_t opcode;
  uint16_t block;
  uint8_t data[512];
} __attribute__((packed)) TTFTP_DATA;

typedef struct rq {
  uint16_t opcode;
  char filename[256];
  char mode[16];
} __attribute__((packed)) TTFTP_RQ;

void print_binary_data_buf(uint8_t *buf, size_t size) {
  for (int i = 0; i < size; i++) {
    printf("%02x ", *(buf + i));
  }
  printf("\n");
}

TTFTP_OPCODE get_opcode(uint16_t *buf, size_t size) {
  uint16_t opcode = ntohs(*buf);
  if (opcode == ACK) {
    return ACK;
  } else if (opcode == DATA) {
    return DATA;
  } else if (opcode == RRQ) {
    return RRQ;
  } else if (opcode == WRQ) {
    return WRQ;
  } else {
    fprintf(stderr, "Unable to identify opcode\n");
    exit(1);
  }
}

void deserialize(uint8_t *buf, size_t packet_size, void *packet,
                 TTFTP_OPCODE opcode) {

  printf("deserializing...\n");
  if (opcode == ACK) {
    TTFTP_ACK *ack = (TTFTP_ACK *)packet;
    memcpy(ack, buf, sizeof(TTFTP_ACK));
    ack->opcode = ntohs(ack->opcode);
    ack->block_number = ntohs(ack->block_number);
    return;

  } else if (opcode == DATA) {
    TTFTP_DATA *data = (TTFTP_DATA *)packet;
    memcpy(data, buf, sizeof(TTFTP_DATA));
    data->opcode = ntohs(data->opcode);
    data->block = ntohs(data->block);
    return;

  } else if (opcode == RRQ || opcode == WRQ) {
    printf("matched!\n");
    TTFTP_RQ *rq = (TTFTP_RQ *)packet;

    rq->opcode = ntohs(*(uint16_t *)buf);
    printf("rq opcode: %u\n", rq->opcode);

    strcpy(rq->filename, (char *)(buf + 2));
    size_t filename_len = strlen(rq->filename);
    if (filename_len == 0 || filename_len > 255) {
      perror("invalid filename\n");
      exit(1);
    }
    strcpy(rq->mode, (char *)(buf + 2 + filename_len + 1));
    size_t mode_len = strlen(rq->mode);

    if (mode_len == 0 || filename_len > 15) {
      perror("invalid mode\n");
      exit(1);
    }

    printf("Opcode: %u\n", rq->opcode);
    printf("Filename: %s\n", rq->filename);
    printf("Mode: %s\n", rq->mode);
    return;
  }

  fprintf(stderr, "failed to deserialize\n");
  exit(1);
}

int send_ack(int fd, uint16_t block_number, struct sockaddr_in *sock_addr) {

    TTFTP_ACK ack = {
        .opcode = htons(ACK),
        .block_number = htons(block_number),
    };

    printf("sending ack for block num %u\n", block_number);

    int rv = sendto(fd, (uint8_t *)&ack, sizeof(ack), 0,
                    (struct sockaddr *)sock_addr, sizeof(*sock_addr));
    if (rv != 4) {
        fprintf(stderr, "failed to send ack for block number: %u\n", block_number);
        return 1;
    }
    return 0;
}

int send_rq(int fd, const char *filename, TTFTP_OPCODE opcode,
            struct sockaddr_in *sock_addr) {
  uint8_t buf[512];
  const char *mode = "octet";
  int offset = 0;

  // set opcode
  if (opcode == RRQ) {
    *(uint16_t *)buf = htons(RRQ);
  } else if (opcode == WRQ) {
    *(uint16_t *)buf = htons(WRQ);
  }
  offset += 2;

  strcpy((char *)(buf + offset), filename);
  offset += strlen(filename) + 1;

  strcpy((char *)(buf + offset), mode);
  offset += strlen(mode) + 1;

  printf("sending %s for file name: %s\n", opcode_to_string(opcode), filename);
  int rv = sendto(fd, buf, offset, 0, (struct sockaddr *)sock_addr,
                  sizeof(*sock_addr));
  if (rv == -1 ) {
    fprintf(stderr, "failed to send %s for file name: %s\n",
            opcode_to_string(opcode), filename);
    return 1;
  }
  return 0;
}


void send_data(int fd, uint8_t *bytes_read, size_t num_bytes_read, uint16_t block_number, struct sockaddr_in *sock_addr){
    TTFTP_DATA data = {
        .opcode = htons(DATA),
        .block = htons(block_number),
    };
    memcpy(data.data, bytes_read, num_bytes_read);
    printf("sending block %zu with %zu bytes...\n", block_number, num_bytes_read);
    int offset = 2+2+num_bytes_read;
    int rv = sendto(fd, (uint8_t*)&data, offset, 0, (struct sockaddr *)sock_addr,
                  sizeof(*sock_addr));
    if (rv <= 0){
      perror("failed to send block data\n");
      exit(1);
    }
    printf("Sent data!\n");
}