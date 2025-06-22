#define _GNU_SOURCE
#include <stdio.h>
#include <sched.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <sys/mount.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>

#define STACK_SIZE 65536
#define CONTAINER_ROOT "/home/hector/rootfs"
#define CCRUN_CGROUP_NAME "ccrun"

void create_cgroup(char const *cgroup_name)
{
    // Assumes cgroups v2
    printf("creating cgroup %s\n", cgroup_name);

    char file_path[256];
    snprintf(file_path, sizeof(file_path), "/sys/fs/cgroup/%s", cgroup_name);

    struct stat st;
    if (stat(file_path, &st) == 0)
    {
        printf("cgroup already exists\n");
    }
    else if (mkdir(file_path, 0755) == -1)
    {
        perror("mkdir cgroup failed");
        exit(1);
    }

    // Set memory usage upper limit to 128MB
    snprintf(file_path, sizeof(file_path), "/sys/fs/cgroup/%s/memory.max", cgroup_name);
    int fd = open(file_path, O_WRONLY);
    if (fd == -1)
    {
        perror("failed to create memory.max");
        exit(1);
    }
    int res = write(fd, "134217728", 9);
    if (res == -1)
    {
        perror("failed to write to memory.max");
        exit(1);
    }
    close(fd);
    printf("set memory limit to 128mb\n");

    // Set cpu usage limit to 50% of one cpu (50000 out of 100000 microseconds per period)
    snprintf(file_path, sizeof(file_path), "/sys/fs/cgroup/%s/cpu.max", cgroup_name);
    fd = open(file_path, O_WRONLY);
    if (fd != -1)
    {
        write(fd, "50000 100000", 12);
        close(fd);
        printf("Set CPU limit: 50%% of one CPU\n");
    }
}

void add_to_cgroup(const char *cgroup_name, pid_t pid)
{
    char file_path[256];
    char pid_str[32];

    snprintf(pid_str, sizeof(pid_str), "%d", pid);

    snprintf(file_path, sizeof(file_path), "/sys/fs/cgroup/%s/cgroup.procs", cgroup_name);
    int fd = open(file_path, O_WRONLY);
    if (fd != -1)
    {
        int res = write(fd, pid_str, sizeof(pid_str));
        if (res == -1)
        {
            perror("failed to write to cgroup.procs");
            exit(1);
        }
        printf("added pid %s to cgroup\n", pid_str);
        close(fd);
        return;
    }
    perror("failed to open cgroup.procs\n");
    exit(1);
}

void map_uid_gid(pid_t container_pid)
{
    // map container nobody uid -> host
    char uid_path[256];
    char gid_path[256];
    char setgroup_path[256];

    // default to uid/gid 1000
    uid_t uid = getuid() == 0 ? 1000 : getuid();
    gid_t gid = getgid() == 0 ? 1000 : getgid();

    printf("calling host uid: %d\n", uid);
    printf("calling host gid: %d\n", gid);

    // MUST disable setgroups FIRST, before any mapping
    snprintf(setgroup_path, sizeof(setgroup_path), "/proc/%d/setgroups", container_pid);
    int fd = open(setgroup_path, O_WRONLY);
    if (fd == -1)
    {
        perror("open setgroups failed");
        exit(1);
    }
    if (write(fd, "deny", 4) == -1)
    {
        perror("write setgroups failed");
        exit(1);
    }
    close(fd);

    snprintf(uid_path, sizeof(uid_path), "/proc/%d/uid_map", container_pid);
    snprintf(gid_path, sizeof(gid_path), "/proc/%d/gid_map", container_pid);

    fd = open(uid_path, O_WRONLY);
    if (fd == -1)
    {
        perror("open uid_path failed");
        exit(1);
    }

    char mapping[50];

    snprintf(mapping, sizeof(mapping), "0 %d 1", uid);
    if (write(fd, mapping, strlen(mapping)) == -1)
    {
        perror("write failed");
        exit(1);
    }
    close(fd);

    int fd2 = open(gid_path, O_WRONLY);
    if (fd2 == -1)
    {
        perror("open gid_path failed");
        exit(1);
    }
    char mapping2[50];

    snprintf(mapping2, sizeof(mapping2), "0 %d 1", gid);
    if (write(fd2, mapping2, strlen(mapping2)) == -1)
    {
        perror("write2 failed");
        exit(1);
    }
    close(fd2);
}

int child_ccrun(void *argv)
{

    int pipe_fd = **(int **)argv;
    char signal_byte;

    if (read(pipe_fd, &signal_byte, 1) != 1)
    {
        perror("sync read failed");
        exit(1);
    }
    close(pipe_fd);

    if (chroot(CONTAINER_ROOT) == -1)
    {
        perror("chroot failed");
        exit(1);
    }
    if (setuid(0) == -1)
    {
        perror("setuid failed");
        exit(1);
    }
    if (setgid(0) == -1)
    {
        perror("setgid failed");
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

    char **argv2 = *((char ***)argv + 1);
    printf("argv2[0]: %s\n", *argv2);
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

        int sync_pipe[2];
        if (pipe(sync_pipe) == -1)
        {
            perror("sync pipe failed");
            return -1;
        }
        char *stack = malloc(STACK_SIZE);

        void *child_args[] = {&sync_pipe[0], &argv[2]};

        create_cgroup(CCRUN_CGROUP_NAME);

        // clone in another namespace and change hostname and run child proces
        pid_t pid = clone(child_ccrun, stack + STACK_SIZE, CLONE_NEWUTS | CLONE_NEWNS | CLONE_NEWPID | CLONE_NEWUSER | SIGCHLD, child_args);
        if (pid == -1)
        {
            perror("clone failed");
            return 1;
        }

        add_to_cgroup(CCRUN_CGROUP_NAME, pid);
        map_uid_gid(pid);

        char signal = 'X';
        if (write(sync_pipe[1], &signal, 1) != 1)
        {
            perror("sync write failed");
            return 1;
        }

        close(sync_pipe[0]);
        close(sync_pipe[1]);

        int status;
        wait(&status);

        free(stack);

        if (WIFEXITED(status))
        {
            int exit_code = WEXITSTATUS(status);
            printf("Exited with exit code: %i\n", exit_code);
            return exit_code;
        }
    }

    return 0;
}