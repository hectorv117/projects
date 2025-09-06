#include <arpa/inet.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define BUFFER_SIZE 4096
#define SERVER_MESSAGE "hello from miniserver!\n"
#define test
int main() {
  // message_len = strlen(SERVER_MESSAGE);

  int server_fd, client_fd;
  struct sockaddr_in address;
  int addrlen = sizeof(address);
  char client_buffer[BUFFER_SIZE] = {0};
  char server_message_buffer[BUFFER_SIZE] = {0};
  int message_size = strlen(SERVER_MESSAGE);
  snprintf(server_message_buffer, BUFFER_SIZE,
           "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: "
           "%d\r\nConnection: keep-alive\r\n\r\n%s",
           message_size, SERVER_MESSAGE);

  server_fd = socket(AF_INET, SOCK_STREAM, 0);

  // allow socket reuse
  int opt = 1;
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  address.sin_family = AF_INET;
  address.sin_addr.s_addr = INADDR_ANY;
  address.sin_port = htons(8080);

  if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) != 0) {

    perror("error binding socket fd to address aka ip + port!!\n");
  }

  listen(server_fd, 3);
  printf("listening on localhost:8080 ...\n");
  int keep_listening = 1;

  while (keep_listening) {

    client_fd =
        accept(server_fd, (struct sockaddr *)&address, (unsigned *)&addrlen);
    if (client_fd < 0) {
      perror("accepting client failed!\n");
      continue;
    }

    while (1) {

      memset(client_buffer, 0, BUFFER_SIZE);
      int bytes_read = read(client_fd, client_buffer, BUFFER_SIZE);

      if (bytes_read <= 0) {

        break; // client disconnected?
      }

      printf("Client Message: %s\n", client_buffer);
      //printf("Client Message Size: %lu\n\n", strlen(client_buffer));

      printf("\n parsing http...\n");
      char *line = strtok(client_buffer, "\n");
      char *key = "Content-Length:";
      int len = 0;
      while (line) {
        if (len > 0) {
          line = strtok(NULL, "\n");
          //printf("Client: %s\n", line);
          char *quit_msg = "quit";
          if (strncmp(line, quit_msg, strlen(quit_msg)) == 0) {
            printf("ok bye bye\n");
            keep_listening = 0;
            break;
          }
        }
        if (strncmp(line, key, strlen(key)) == 0) {
          printf("cmp success\n");
          len = atoi(line + strlen(key));
          //printf("extracted content-len: %d\n", len);
        }

        line = strtok(NULL, "\n");
      }

      printf("parsing completed!\n");
      send(client_fd, server_message_buffer, strlen(server_message_buffer), 0);
    }
    close(client_fd);
  }
  close(server_fd);
  return 0;
}
