#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include "packets.h"

int main(int argc, char const *argv[])
{
    
    int sock_fd = socket(AF_INET ,SOCK_DGRAM, 0);
    if (sock_fd == -1){
       perror("Failed to create UDP socket"); 
       return 1;
    } 

    struct sockaddr_in server_addr = {0};
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(69);
    server_addr.sin_addr.s_addr = INADDR_ANY;
    if (bind(sock_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0){
        perror("bind error");
        return 1;
    }
    char buffer[1024];

    struct sockaddr_in client_addr;
    socklen_t addr_len = sizeof(client_addr);

    int n = recvfrom(sock_fd, buffer, sizeof(buffer), 0, (struct sockaddr*)&client_addr, &addr_len);
    if (n < 1){
        printf("Nothing received or something went wrong\n");
        return 1;
    }

    printf("n: %u\n", n);

    buffer[n] = '\0';
    printf("Received ");
    print_binary_data_buf((uint8_t*)&buffer, n);
    return 0;
}
