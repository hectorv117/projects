#include "packets.h"
#include <arpa/inet.h>
#include <netinet/in.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>

int main(int arc, char **argv) {

  char file_name[50];
  printf("Enter the name of the file: ");
  scanf("%s", file_name);

  int sockfd = socket(AF_INET, SOCK_DGRAM, 0);

  struct sockaddr_in server_addr = {0};
  server_addr.sin_family = AF_INET;
  server_addr.sin_port = htons(69);
  inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);

  // socket address structure needed to RECEIVE packets from the server
  struct sockaddr_in from_addr;
  socklen_t addr_len = sizeof(from_addr);

  // int rv = send_ack(sockfd, 0, &server_addr);
  int rv = send_rq(sockfd, file_name, RRQ, &server_addr);
  printf("sent packet? return value: %u\n", rv);
  if (rv != 0)
    return 1;

  // wait for ack 0 response from server

  uint8_t ack_buf[4];
  int n = recvfrom(sockfd, ack_buf, sizeof(ack_buf), 0,
                   (struct sockaddr *)&from_addr, &addr_len);
  //   printf("Received %u bytes from server\n", n);
  TTFTP_ACK ack_zero = *(TTFTP_ACK *)&ack_buf;
  if (ntohs(ack_zero.opcode) != ACK || ack_zero.block_number != 0) {
    fprintf(stderr, "ack zero wasn't received from server\n");
    return 1;
  }

  // waiting for data packets
  printf("waiting for data packets..\n");
  uint8_t data_buf[516];
  FILE *file = NULL;
  char client_file_name[100] = "client_";
  strncat(client_file_name, file_name, 50);

  while ((n = recvfrom(sockfd, data_buf, sizeof(data_buf), 0,
                       (struct sockaddr *)&from_addr, &addr_len)) > 0) {

    printf("recieved %u bytes\n", n);
    // print_binary_data_buf(data_buf, n);

    printf("checking opcode...\n");

    if (get_opcode((uint16_t *)data_buf, n) == DATA) {

        printf("Data packet received\n");
        TTFTP_DATA *data_packet = (TTFTP_DATA*)data_buf;
        print_binary_data_buf((uint8_t *)data_packet, n);
        if (file == NULL) {
            file = fopen(client_file_name, "w");

            if (file == NULL) {
            printf("Error opening file\n");
            return -1;
            }
        }

        printf("writing...\n");
        if (fwrite(data_packet->data , 1, n - 4, file) == n - 4) {
            printf("wrote %u bytes!\n", n-4);
            if (n - 4 < 512){
                printf("less than 512 bytes\n");
                break;
            }
        } else {

            perror("Error writing to file");
            fclose(file);
            return 1;
        }
    }
  }

  fclose(file);
  printf("done!\n");

  return 0;
}