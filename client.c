#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include "packets.h"


int main(int arc, char **argv){

    int sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    struct sockaddr_in server_addr = {0};
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(69);
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);

    TTFTP_ACK first_ack = {
        .opcode = htons(ACK),
        .block_number = htons(0)
    };

    size_t psize = sizeof(first_ack);
    unsigned char buf[psize];
    int res = serialize(&first_ack, buf, psize+1);
    if (res == 1) return 1;
    printf("sending packet now...\n");
    int rv = sendto(sockfd, buf, sizeof(buf), 0, (struct sockaddr*)&server_addr, sizeof(server_addr));    
    
    printf("sent packet? return value: %u\n", rv);

}