
#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/uaccess.h>


static int device_file_major_number = 0;
static const char device_name[] = "mydriver";
static const char hellowrldstr[] = "helloooooooo\n";
static const ssize_t hellowrld_size = sizeof(hellowrldstr);


int register_device(void);
void unregister_device(void);
static ssize_t device_file_read(struct file*, char*, size_t, loff_t *);


static struct file_operations mydriver_fops = {
    .owner = THIS_MODULE,
    .read = device_file_read,
};


int register_device(void){
    int res = 0;
    printk(KERN_NOTICE "mydriver: register_device() is called...n");
    res = register_chrdev(0, device_name, &mydriver_fops);
    if (res < 0){
        printk( KERN_WARNING "mydriver: cant register char device... error code = %i\n", res);
        return res;
    }
    device_file_major_number = res;
    printk (KERN_NOTICE "mydriver: registered char dev with major number %i and minor numbers 0-255\n", device_file_major_number);
    return 0;
    
}

void unregister_device(void){
    printk( KERN_NOTICE "mydriver: unregister_device() called...\n");
    if(device_file_major_number != 0){
        unregister_chrdev(device_file_major_number, device_name);
    }
}



static ssize_t device_file_read(struct file *file_ptr, char __user *user_buffer, size_t count, loff_t *position){

    printk(KERN_NOTICE "mydriver: device file offset is %i, number of bytes read = %u\n", (int)*position, (unsigned int)count);

    if ( *position >= hellowrld_size){
        return 0;
    }
    if (*position + count >= hellowrld_size){
        count = hellowrld_size - *position;
    }
    if (copy_to_user(user_buffer, hellowrldstr + *position, count) != 0){
        return -EFAULT;
    }
    *position += count;
    return count;
}



static int my_init(void){
    return register_device();
}

static void my_exit(void){
    unregister_device();
    return;
}

module_init(my_init);
module_exit(my_exit);

// ... your existing code ...

MODULE_LICENSE("GPL");
MODULE_AUTHOR("hectorvazzz");
MODULE_DESCRIPTION("My Linux kernel module");
MODULE_VERSION("1.0");
