.PHONY: clean all
all: test server client

test: test.c
	clang test.c -o test

server: server.c
	clang server.c -o server

client: client.c
	clang client.c -o client

clean:
	-rm -f *.o $(objects) test client server client_test.txt client_binary_test
