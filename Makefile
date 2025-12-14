
test: test.c
	clang test.c -o test

server: server.c
	clang server.c -o server

client: client.c
	clang client.c -o client

.PHONY: clean
clean:
	-rm -f *.o $(objects) test client server