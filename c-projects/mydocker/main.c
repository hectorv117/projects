#define _GNU_SOURCE
#include <stdio.h>
#include <sched.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <sys/mount.h>
#include <unistd.h>
#include <fcntl.h>

#define STACK_SIZE 65536

#define CONTAINER_ROOT "/"

void map_uid_gid(pid_t container_pid)
{

    // map container nobody uid -> host
    char uid_path[256];
    char gid_path[256];

    snprintf(uid_path, sizeof(uid_path), "/proc/%d/uid_map", container_pid);
    snprintf(gid_path, sizeof(gid_path), "/proc/%d/gid_map", container_pid);

    int fd = open(uid_path, O_WRONLY);
    if (fd == -1){
        perror("open uid_path failed");
        exit(1);
    }

    char mapping[50];

    snprintf(mapping, sizeof(mapping), "0 %d 1", getuid());
    if (write(fd, mapping, strlen(mapping)) == -1)
    {
        perror("write failed");
        exit(1);
    }
    close(fd);

    int fd2 = open(gid_path, O_WRONLY);
    if (fd2 == -1){
        perror("open gid_path failed");
        exit(1);
    }
    char mapping2[50];

    snprintf(mapping2, sizeof(mapping2), "0 %d 1", getgid());
    if (write(fd2, mapping2, strlen(mapping2)) == -1)
    {
        perror("write2 failed");
        exit(1);
    }
    close(fd2);
}

int child_ccrun(void *argv)
{

    if (chroot(CONTAINER_ROOT) == -1)
    {
        perror("chroot failed");
        exit(1);
    }

    if (unshare(CLONE_NEWNS) == -1)
    {
        perror("unshare mount namespace failed");
        exit(1);
    }

    if (sethostname("container", 9) == -1)
    {
        perror("sethostname failed");
        exit(1);
    }

    if (mount("proc", "/proc", "proc", 0, NULL) == -1)
    {
        perror("mount /proc failed");
        exit(1);
    }

    char **argv2 = (char **)argv;
    execv(argv2[0], &argv2[0]);
    perror("execv failed");
    exit(1);
}

int main(int argc, char *argv[])
{

    if (argc < 3)
    {
        printf("argc: %i \n", argc);
        printf("Wrong! You gave me: ");
        for (int i = 0; i < argc; i++)
        {
            printf("%s ", argv[i]);
        }
        printf("\nuse me like this: ccrun run <command> <args> \n");
        return 1;
    }

    if (strcmp(argv[1], "run") != 0)
    {
        printf("unrecognized first command: %s \n", argv[1]);
        return 1;
    }
    else
    {
        // clone in another namespace and change hostname and run child proces

        char *stack = malloc(STACK_SIZE);
        pid_t pid = clone(child_ccrun, stack + STACK_SIZE, CLONE_NEWUTS | CLONE_NEWPID | CLONE_NEWUSER | SIGCHLD, &argv[2]);
        if (pid == -1)
        {
            perror("clone failed");
            return 1;
        }

        map_uid_gid(pid);

        int status;
        wait(&status);

        if (WIFEXITED(status))
        {
            int exit_code = WEXITSTATUS(status);
            printf("Exited with exit code: %i\n", exit_code);
            return exit_code;
        }
    }

    return 0;
}