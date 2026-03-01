#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include "packets.h"


int main(int arc, char **argv){

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
    if (rv != 0) return 1;

    //wait for ack 0 response from server

    uint8_t ack_buf[4];
    int n = recvfrom(sockfd, ack_buf, sizeof(ack_buf), 0, (struct sockaddr*)&from_addr, &addr_len);
    printf("Received %u bytes from server\n", n);
    TTFTP_ACK ack_zero = *(TTFTP_ACK*)&ack_buf;
    if (ntohs(ack_zero.opcode) != ACK || ack_zero.block_number != 0){
        fprintf(stderr, "ack zero wasn't received from server\n");
        return 1;
    }

    // waiting for data packets
    printf("waiting for data packets..\n");
    uint8_t data_buf[516];
    n = recvfrom(sockfd, data_buf, sizeof(data_buf), 0, (struct sockaddr*)&from_addr, &addr_len);
    
    if (n > 0) printf("recieved %u bytes\n", n);
    print_binary_data_buf(data_buf, n);

    printf("writing...\n");
    FILE *file;
    //file = fopen(file_name, "w");
    file = fopen("test_client.txt", "w");

    if (file == NULL){
        printf("Error opening file\n");
        return -1;
    }

    if (fwrite(data_buf, 1, n, file)!= n){
        perror("Error writing file");
        fclose(file);
        return 1;
    }
    fclose(file);
    printf("done!\n");

    return 0;

}