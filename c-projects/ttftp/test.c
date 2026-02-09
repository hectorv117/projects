#include "packets.h"
#include <assert.h>
#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void test_send_rrq(int sockfd, struct sockaddr_in *server_addr) {
  printf("Testing sending an RRQ...\n");
  int rv = send_rq(sockfd, "test.txt", RRQ, server_addr);
  assert(rv == 0);
  printf("Success!\n");
}

void test_received_ack(int sockfd, struct sockaddr_in *from_addr) {
  printf("Testing receiving ACK from server...\n");
  uint8_t ack_buf[4];
  socklen_t addr_len = sizeof(*from_addr);
  int n = recvfrom(sockfd, ack_buf, sizeof(ack_buf), 0,
                   (struct sockaddr *)&from_addr, &addr_len);
  assert(n > 0);
  printf("Received %u bytes from server\n", n);
  printf("Checking that an initial ACK 'zero' response was returned...\n");
  TTFTP_ACK ack_zero = *(TTFTP_ACK *)&ack_buf;
  assert(ntohs(ack_zero.opcode) == ACK);
  assert(ack_zero.block_number == 0);
  printf("Success!\n");
}

int main(int arc, char **argv) {

  // Setup UDP client socket
  int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
  if (sockfd == -1) {
    perror("Failed to create socket\n");
    exit(1);
  }

  // Set socket timeout BEFORE sending
  struct timeval tv;
  tv.tv_sec = 5; // 5 second timeout
  tv.tv_usec = 0;
  if (setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv)) < 0) {
    perror("setsockopt failed");
    exit(1);
  }

  // Setup server address information
  struct sockaddr_in server_addr = {0};
  server_addr.sin_family = AF_INET;
  server_addr.sin_port = htons(69);
  inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);

  char sanity_test_buffer[] = "Server, are you there?";
  int rv = sendto(sockfd, sanity_test_buffer, strlen(sanity_test_buffer), 0,
                  (struct sockaddr *)&server_addr, sizeof(server_addr));
  printf("received value: %u\n", rv);
  if (rv == -1) {
    printf("hmm something went wrong trying to send the sanity msg\n");
    exit(1);
  }

  char sanity_buffer[100];
  socklen_t addr_len = sizeof(server_addr);
  printf("Waiting for server response...\n");
  int n = recvfrom(sockfd, sanity_buffer, sizeof(sanity_buffer), 0,
                   (struct sockaddr *)&server_addr, &addr_len);

  if (n == -1) {
    if (errno == EWOULDBLOCK || errno == EAGAIN) {
      printf("Timeout: No response from server.\n"
             "Make sure it's running on 127.0.0.1:69\n");
    } else {
      perror("recvfrom failed");
    }
    exit(1);
  }

  print_binary_data_buf(&sanity_buffer, n);
  if (strncmp(sanity_buffer, "I am here", strlen("I am here")) == 0) {
    printf("Sanity test passed!\n");
  } else {
    printf("hmm didn't get the write response from the serever...\n");
    exit(1);
  }

  test_send_rrq(sockfd, &server_addr);
  close(sockfd);

  return 0;
}