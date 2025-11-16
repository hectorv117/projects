#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>

#define RDBIT 0x0100

typedef struct header {
    uint16_t id;
    uint16_t flags;
    uint16_t QDCOUNT;
    uint16_t ANCOUNT;
    uint16_t NSCOUNT;
    uint16_t ARCOUNT;
} __attribute__((packed)) DNSHeader;


typedef struct question {
    unsigned char *QNAME;
    uint16_t QTYPE;
    uint16_t QCLASS;

} __attribute__((packed)) DNSQuestion;


typedef struct RR{
    uint16_t TYPE;
    uint16_t CLASS;
    uint32_t TTL;
    uint16_t RDLENGTH;
    unsigned char *NAME;
} __attribute__((packed)) DNSRR;

typedef struct dnsmessage{
    DNSHeader header;
    DNSQuestion question;
} __attribute__((packed)) DNSMessage;


void serializeDNSM(const DNSMessage *msg, uint8_t *buf){
    printf("serializing dnsm msg...\n");
    ssize_t offset = 0;

    uint16_t id = htons(msg->header.id);
    uint16_t flags = htons(msg->header.flags);
    uint16_t qdcount = htons(msg->header.QDCOUNT);
    uint16_t ancount = htons(msg->header.ANCOUNT);
    uint16_t arcount = htons(msg->header.ARCOUNT);
    uint16_t nscount = htons(msg->header.NSCOUNT);


    printf("memcpying header...\n");
    memcpy(buf + offset, &id, 2); offset+=2;
    memcpy(buf + offset, &flags, 2); offset+=2;
    memcpy(buf + offset, &qdcount, 2); offset+=2;
    memcpy(buf + offset, &ancount, 2); offset+=2;
    memcpy(buf + offset, &arcount, 2); offset+=2;
    memcpy(buf + offset, &nscount, 2); offset+=2;

    unsigned char *p = msg->question.QNAME;
    if (p != NULL){
        
        printf("memcpying qname...\n");
        while (*p != '\0'){
            memcpy(buf+offset, p, 1);
            offset++;
            p++;
        }
    memcpy(buf+offset, p, 1);
    offset++;
    }
    uint16_t qtype = htons(msg->question.QTYPE);
    uint16_t qclass = htons(msg->question.QCLASS);
    printf("memcpying question...\n");
    memcpy(buf + offset, &qtype, 2); offset+=2;
    memcpy(buf + offset, &qclass, 2); offset+=2;
    printf("finished serializing!!\n");
}


void printbuf(uint8_t *buf, size_t len){
    printf("priting a buf of size: %zu\n", len);
    for (int i = 0; i<len; i++){
        printf("%02x", buf[i]);
    }
    printf("\n");
}

void encodeName(unsigned char *name, unsigned char *buf){
    // dns.google.com
    // 3dns6google3com0

    if (name == NULL) {
        perror("NULL name");
    }

    size_t count = 0;
    size_t offset = 0;
    unsigned char *c = name;
    printf("reading name chars writing to buf\n");
    while (*c != '\0'){
        if ( *c != '.'){
            buf[offset+count+1] = *c;
            count++; 
        }
        else{
            buf[offset] = count;
            offset = count+offset+1;
            count = 0;
        }
        c++;
    }

    buf[offset] = count;
    offset = count+offset+1;
    printf("finished encoding: %s\n", buf);
    printf("final buf size: %zu\n", strlen(buf));
}


int main(void){

    DNSMessage firstdnsm = {};
    firstdnsm.header.id = 22;
    firstdnsm.header.flags = RDBIT;
    firstdnsm.header.QDCOUNT = 1;
    firstdnsm.header.ANCOUNT = 0;
    firstdnsm.header.ARCOUNT = 0;
    firstdnsm.header.NSCOUNT = 0;
  
    unsigned char namebuf[strlen("dns.google.com")];
    encodeName("dns.google.com", namebuf);
    firstdnsm.question.QNAME = namebuf;
    firstdnsm.question.QTYPE = 1;
    firstdnsm.question.QCLASS = 1;
    
    size_t msg_len = sizeof(firstdnsm) + strlen(firstdnsm.question.QNAME) - sizeof(firstdnsm.question.QNAME) + 1;
    uint8_t dnsmBuffer[msg_len];
    serializeDNSM(&firstdnsm, dnsmBuffer);
    printbuf(dnsmBuffer, msg_len);
}
