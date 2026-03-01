#include "packets.h"
#include <arpa/inet.h>
#include <netinet/in.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

int sanity_done = 0;

void sanity_response(int fd, struct sockaddr_in *client_addr) {

  printf("Sending sanity response...\n");
  char buffer[] = "I am here";
  int rv = sendto(fd, buffer, strlen(buffer), 0, (struct sockaddr *)client_addr,
                  sizeof(*client_addr));
  printf("rv: %u\n", rv);
  if (rv == -1) {
    printf("Error sending sanity response.\n");
    printf("Continuing anyway...\n");
  }
  sanity_done = 1;
}

int main(int argc, char const *argv[]) {

  int dev_mode = 0;
  if (argc == 2) {
    if (strncmp("dev", argv[1], 3) == 0) {
      printf("running in dev mode...\n");
      dev_mode = 1;
    }
  }

  int sock_fd = socket(AF_INET, SOCK_DGRAM, 0);
  if (sock_fd == -1) {
    perror("Failed to create UDP socket");
    return 1;
  }

  struct sockaddr_in server_addr = {0};
  server_addr.sin_family = AF_INET;
  server_addr.sin_port = htons(69);
  server_addr.sin_addr.s_addr = INADDR_ANY;
  if (bind(sock_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
    perror("bind error");
    return 1;
  }
  uint8_t buffer[1024];

  struct sockaddr_in client_addr;
  socklen_t addr_len = sizeof(client_addr);

  int rrq_received = 0;
  int wrq_received = 0;
  FILE *file;
  while (1) {
    printf("listening...\n");
    int n = recvfrom(sock_fd, buffer, sizeof(buffer), 0,
                     (struct sockaddr *)&client_addr, &addr_len);
    if (n > 0) {
      printf("Received %u bytes: ", n);
      print_binary_data_buf(&buffer, n);

      if (dev_mode) {
        if (sanity_done != 1) {
          size_t sanity_str_len = strlen(SANITY_STR);

          if (strncmp(buffer, SANITY_STR, sanity_str_len) == 0) {
            sanity_response(sock_fd, &client_addr);
          }
          continue;
        }
      }

      TTFTP_OPCODE opcode = get_opcode(buffer, n);
      printf("received opcode: %u\n", opcode);

      void *packet = malloc(n);
      deserialize(buffer, n, packet, opcode);
      // Initial RRQ
      if (!rrq_received && opcode == RRQ) {
        rrq_received = 1;
        TTFTP_RQ rrq = *(TTFTP_RQ *)packet;
        file = fopen(rrq.filename, "r");
        if (file == NULL) {
          perror("RRQ: ");
          free(packet);
          continue;
        }
        printf("requested file exists, sending ack...\n");
        // send ack
        send_ack(sock_fd, 0, &client_addr);

        // begin sending file in 512B blocks

        uint8_t file_buffer[512];
        size_t num_bytes_read;
        uint16_t block_number = 1;
        uint16_t ack_buf[2];
        long total_bytes_sent = 0;

        // printf("sending packets...\n");
        // continously send 512B blocks
        while ((num_bytes_read = fread(file_buffer, 1, 512, file)) == 512) {
          send_data(sock_fd, file_buffer, num_bytes_read, block_number,
                    &client_addr);
          total_bytes_sent += num_bytes_read;
          // wait for ack
          if (receive_ack(sock_fd, block_number, &client_addr, ack_buf) != 0) {
            printf("Failed to receive ACK %u from client\n", block_number);
            return 1;
          }
          block_number++;
        }

        if (num_bytes_read == 0) {
          printf("EOF or error\n");
          printf("total bytes sent: %zu\n", total_bytes_sent);
          rrq_received = 0;
        }

        // send last block < 512
        if (num_bytes_read > 0) {
          printf("sending final data block\n");
          send_data(sock_fd, file_buffer, num_bytes_read, block_number,
                    &client_addr);
          // wait for ack
          printf("waiting for ack %u\n", block_number);
          if (receive_ack(sock_fd, block_number, &client_addr, ack_buf) != 0) {
            printf("Failed to receive ACK %u from client\n", block_number);
          }
          rrq_received = 0;
        }
      }
    }
  }
  return 0;
}
