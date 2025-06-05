---
title: "Create SWAP Memory on CentOS, AlmaLinux, and Ubuntu"
slug: "create-swap-memory-centos-ubuntu-linux"
excerpt: "Complete guide to creating and configuring SWAP memory on Linux systems including CentOS, AlmaLinux, and Ubuntu. Learn SWAP sizing, performance optimization, and best practices for virtual memory management."
published: true
publishedAt: "2020-02-15T10:30:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "System Administration"
tags: ["swap", "memory", "virtual-memory", "centos", "ubuntu", "almalinux", "linux", "performance", "server-administration"]
seo:
  title: "Create SWAP Memory on Linux - CentOS, AlmaLinux, Ubuntu"
  description: "Step-by-step guide to create and configure SWAP memory on CentOS, AlmaLinux, and Ubuntu. Includes sizing recommendations, performance tuning, and troubleshooting."
  keywords: ["swap memory", "linux swap", "centos swap", "ubuntu swap", "virtual memory", "linux memory management", "swap file", "swap partition"]
  canonical: "https://linux-id.net/posts/create-swap-memory-centos-ubuntu-linux"
---

**SWAP memory** is a crucial component of Linux virtual memory management that extends available system memory by using disk space as temporary storage for inactive processes. When physical RAM becomes full, the Linux kernel moves less frequently used data from RAM to SWAP space, preventing system crashes and maintaining performance.

This comprehensive guide covers creating, configuring, and optimizing SWAP memory on **CentOS**, **AlmaLinux**, and **Ubuntu** systems with best practices for 2020.

## Understanding SWAP Memory

**SWAP** (also known as virtual memory) is a space on storage devices that the Linux kernel uses as an extension of physical RAM. When the system runs low on physical memory, the kernel moves inactive pages from RAM to SWAP space, freeing up RAM for active processes.

### How SWAP Works

| Component | Function | Performance Impact |
|-----------|----------|-------------------|
| **Physical RAM** | Fast access, primary memory | Fastest access speed |
| **SWAP Space** | Extended memory on disk | Slower than RAM, faster than regular file I/O |
| **Kernel Memory Manager** | Manages memory allocation | Automatic SWAP usage based on system load |

### Types of SWAP

#### 1. SWAP Partition
- **Dedicated disk partition** for SWAP
- **Better performance** than SWAP files
- **Fixed size** - requires repartitioning to resize
- **Recommended** for production servers

#### 2. SWAP File
- **Regular file** used as SWAP space
- **Flexible sizing** - can be resized without repartitioning
- **Slightly slower** than SWAP partitions
- **Easier management** for virtual machines and containers

### When SWAP is Essential

- **Limited RAM**: Systems with less than 4GB RAM
- **Hibernation Support**: Required for suspend-to-disk functionality
- **Memory-intensive Applications**: Databases, web servers, development environments
- **Virtual Machines**: VPS and cloud instances with limited memory
- **Server Environments**: Production servers requiring memory overflow protection

## SWAP Sizing Recommendations

Proper SWAP sizing depends on system RAM, usage patterns, and specific requirements.

### Traditional Sizing Guidelines

| Physical RAM | Recommended SWAP Size | Use Case |
|--------------|----------------------|----------|
| **< 2GB** | 2x RAM | Desktop systems, basic servers |
| **2GB - 8GB** | Equal to RAM | General purpose servers |
| **8GB - 64GB** | 0.5x to 1x RAM | High-memory servers |
| **> 64GB** | 4GB - 8GB minimum | Enterprise servers, databases |

### Modern Sizing Considerations (2020)

#### Cloud and VPS Environments
```bash
# Recommended SWAP sizes for cloud instances
# 1GB RAM → 2GB SWAP
# 2GB RAM → 2GB SWAP  
# 4GB RAM → 2GB SWAP
# 8GB+ RAM → 1GB-2GB SWAP
```

#### Performance-Oriented Sizing
- **SSD Storage**: Smaller SWAP sizes (1GB-2GB) due to faster I/O
- **HDD Storage**: Larger SWAP sizes but consider performance impact
- **Memory-intensive Applications**: Size based on application requirements

#### Hibernation Requirements
```bash
# For hibernation support
SWAP_SIZE = RAM_SIZE + (RAM_SIZE * 0.1)
# Example: 8GB RAM = 8.8GB SWAP minimum
```

## Prerequisites and System Check

Before creating SWAP, verify current system configuration and requirements.

### Check Current SWAP Status

```bash
# Check existing SWAP
swapon --show

# Alternative check
cat /proc/swaps

# Check memory usage
free -h

# Check disk space
df -h
```

### System Requirements

#### CentOS/AlmaLinux Requirements
- **CentOS 7+** or **AlmaLinux 8+**
- **Root privileges** for SWAP creation
- **Available disk space** (recommended minimum 1GB)
- **ext4, xfs, or btrfs** filesystem support

#### Ubuntu Requirements
- **Ubuntu 16.04+** (LTS recommended)
- **Root or sudo access**
- **Available disk space** for SWAP file
- **ext4** filesystem (default and recommended)

### Check Available Disk Space

```bash
# Check filesystem usage
df -h /

# Check available space in /var (common SWAP location)
df -h /var

# Check inode usage
df -i /
```

## Creating SWAP on CentOS and AlmaLinux

### Method 1: SWAP File Creation (Recommended)

#### Step 1: Create SWAP File

```bash
# Create 2GB SWAP file using fallocate (faster)
sudo fallocate -l 2G /swapfile

# Alternative: Create using dd (more compatible)
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# Verify file creation
ls -lh /swapfile
```

#### Step 2: Set Proper Permissions

```bash
# Set restrictive permissions for security
sudo chmod 600 /swapfile

# Verify permissions
ls -l /swapfile
# Should show: -rw------- 1 root root
```

#### Step 3: Create SWAP Filesystem

```bash
# Format file as SWAP
sudo mkswap /swapfile

# Expected output:
# Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
# no label, UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Step 4: Enable SWAP

```bash
# Activate SWAP file
sudo swapon /swapfile

# Verify SWAP is active
swapon --show
free -h
```

#### Step 5: Make SWAP Permanent

```bash
# Backup fstab
sudo cp /etc/fstab /etc/fstab.backup

# Add SWAP entry to fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify fstab entry
tail -1 /etc/fstab
```

### Method 2: SWAP Partition Creation

#### Step 1: Create Partition

```bash
# List available disks
lsblk

# Create partition using fdisk
sudo fdisk /dev/sdb

# Follow these steps in fdisk:
# n (new partition)
# p (primary partition)
# 1 (partition number)
# Enter (default start)
# +2G (size)
# t (change type)
# 82 (Linux swap type)
# w (write changes)
```

#### Step 2: Format SWAP Partition

```bash
# Format partition as SWAP
sudo mkswap /dev/sdb1

# Enable SWAP partition
sudo swapon /dev/sdb1

# Add to fstab for persistence
echo '/dev/sdb1 none swap sw 0 0' | sudo tee -a /etc/fstab
```

### CentOS/AlmaLinux Specific Configuration

#### Configure Firewall (if needed)

```bash
# SWAP doesn't require firewall rules, but ensure system tools work
sudo firewall-cmd --list-all

# If using monitoring tools, allow necessary ports
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

#### SELinux Considerations

```bash
# Check SELinux status
getenforce

# If SELinux is enforcing, ensure proper context
sudo restorecon -v /swapfile

# Check SWAP file context
ls -Z /swapfile
```

## Creating SWAP on Ubuntu

### Method 1: SWAP File Creation (Ubuntu)

#### Step 1: Create SWAP File

```bash
# Create 2GB SWAP file
sudo fallocate -l 2G /swapfile

# Alternative for older Ubuntu versions
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# Verify creation
sudo ls -lh /swapfile
```

#### Step 2: Secure SWAP File

```bash
# Set correct permissions
sudo chmod 600 /swapfile

# Verify permissions
ls -l /swapfile
```

#### Step 3: Setup SWAP

```bash
# Make SWAP file
sudo mkswap /swapfile

# Enable SWAP
sudo swapon /swapfile

# Verify SWAP status
sudo swapon --show
free -h
```

#### Step 4: Persistent SWAP Configuration

```bash
# Backup fstab
sudo cp /etc/fstab /etc/fstab.backup.$(date +%Y%m%d)

# Add SWAP to fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Test fstab entry
sudo mount -a
```

### Method 2: Using Ubuntu's Built-in Tools

#### Using Ubuntu's swap-management Tools

```bash
# Install dphys-swapfile (if not present)
sudo apt update
sudo apt install dphys-swapfile

# Configure SWAP size
sudo nano /etc/dphys-swapfile
```

Edit the configuration:
```bash
# Set SWAP size (in MB)
CONF_SWAPSIZE=2048

# Set SWAP file location
CONF_SWAPFILE=/var/swap
```

```bash
# Apply configuration
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# Enable service
sudo systemctl enable dphys-swapfile
```

## SWAP Performance Optimization

### Configure Swappiness

**Swappiness** controls how aggressively the kernel swaps memory pages to disk.

#### Check Current Swappiness

```bash
# View current swappiness value
cat /proc/sys/vm/swappiness
# Default is usually 60
```

#### Optimize Swappiness Values

| Swappiness Value | Behavior | Use Case |
|------------------|----------|----------|
| **0** | Minimal swapping | High-performance servers |
| **10** | Reduce swapping | Database servers |
| **30** | Balanced approach | General servers |
| **60** | Default setting | Desktop systems |
| **100** | Aggressive swapping | Memory-constrained systems |

#### Set Swappiness Temporarily

```bash
# Set swappiness to 10 (current session)
sudo sysctl vm.swappiness=10

# Verify change
cat /proc/sys/vm/swappiness
```

#### Set Swappiness Permanently

```bash
# Add to sysctl configuration
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# Apply immediately
sudo sysctl -p

# Verify setting
sysctl vm.swappiness
```

### Configure Cache Pressure

```bash
# Optimize cache pressure (default is 100)
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

# Apply changes
sudo sysctl -p
```

### Advanced Performance Tuning

#### Configure SWAP Behavior

```bash
# Add advanced SWAP tuning to sysctl.conf
sudo tee -a /etc/sysctl.conf << EOF
# SWAP Performance Tuning
vm.swappiness=10
vm.vfs_cache_pressure=50
vm.dirty_background_ratio=5
vm.dirty_ratio=10
EOF

# Apply all settings
sudo sysctl -p
```

#### Monitor SWAP Performance

```bash
# Real-time SWAP monitoring
watch -n 1 'free -h && echo "" && swapon -s'

# SWAP usage statistics
vmstat 1 5

# Detailed memory statistics
cat /proc/meminfo | grep -i swap
```

## Managing SWAP Memory

### Monitor SWAP Usage

#### Basic Monitoring Commands

```bash
# Quick SWAP status
free -h

# Detailed SWAP information
swapon -s

# SWAP usage by process
for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file; done | sort -k 2 -n | tail

# System memory summary
cat /proc/meminfo
```

#### Advanced Monitoring Script

```bash
#!/bin/bash
# SWAP Monitoring Script

echo "=== SWAP Memory Status ==="
echo "Date: $(date)"
echo ""

echo "Current SWAP Usage:"
free -h | grep -E "(Mem|Swap)"
echo ""

echo "SWAP Devices:"
swapon --show
echo ""

echo "Top 10 Processes Using SWAP:"
for file in /proc/*/status ; do 
    awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file 2>/dev/null
done | sort -k 2 -n | tail -10
echo ""

echo "Swappiness Setting:"
echo "vm.swappiness = $(cat /proc/sys/vm/swappiness)"
```

### Resize SWAP File

#### Increase SWAP Size

```bash
# Disable current SWAP
sudo swapoff /swapfile

# Create larger SWAP file
sudo fallocate -l 4G /swapfile

# Re-setup SWAP
sudo mkswap /swapfile
sudo swapon /swapfile

# Verify new size
swapon --show
```

#### Decrease SWAP Size

```bash
# Disable SWAP
sudo swapoff /swapfile

# Create smaller SWAP file
sudo fallocate -l 1G /swapfile

# Setup new SWAP
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Remove SWAP

#### Temporary Removal

```bash
# Disable SWAP
sudo swapoff /swapfile

# To re-enable
sudo swapon /swapfile
```

#### Permanent Removal

```bash
# Disable SWAP
sudo swapoff /swapfile

# Remove from fstab
sudo sed -i '/swapfile/d' /etc/fstab

# Delete SWAP file
sudo rm /swapfile

# Verify removal
swapon --show
```

## Troubleshooting Common Issues

### Issue 1: SWAP Not Activating

**Symptoms**: SWAP file created but not showing in `swapon --show`

**Solutions**:

```bash
# Check file permissions
ls -l /swapfile
# Should be 600 (rw-------)

# Check if file is properly formatted
file /swapfile
# Should show: Linux/i386 swap file

# Re-format if necessary
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Issue 2: Performance Issues with SWAP

**Symptoms**: System becomes slow when SWAP is used

**Solutions**:

```bash
# Check swappiness setting
cat /proc/sys/vm/swappiness

# Reduce swappiness for better performance
sudo sysctl vm.swappiness=10

# Check disk I/O performance
iostat -x 1 5

# Consider SSD storage for SWAP
```

### Issue 3: SWAP File Creation Fails

**Symptoms**: `fallocate` or `dd` commands fail

**Solutions**:

```bash
# Check available disk space
df -h /

# Check filesystem type
mount | grep " / "

# For filesystems that don't support fallocate
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# Check for file system errors
sudo fsck /dev/sda1
```

### Issue 4: Permission Denied Errors

**Symptoms**: Cannot create or access SWAP file

**Solutions**:

```bash
# Check current user permissions
whoami
id

# Ensure running with sudo
sudo ls -l /swapfile

# Check SELinux context (CentOS/AlmaLinux)
ls -Z /swapfile
sudo restorecon -v /swapfile
```

### Issue 5: SWAP Not Persistent After Reboot

**Symptoms**: SWAP disappears after system restart

**Solutions**:

```bash
# Check fstab entry
grep swap /etc/fstab

# Add correct entry if missing
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Test fstab
sudo mount -a
sudo swapon -a
```

## Best Practices and Security

### Security Considerations

#### File Permissions

```bash
# Always set restrictive permissions
sudo chmod 600 /swapfile
sudo chown root:root /swapfile

# Verify permissions
ls -l /swapfile
```

#### SWAP Encryption (Advanced)

```bash
# For sensitive data, consider encrypted SWAP
sudo apt install cryptsetup  # Ubuntu
sudo yum install cryptsetup  # CentOS

# Setup encrypted SWAP (requires partition)
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen /dev/sdb1 swap
sudo mkswap /dev/mapper/swap
```

### Performance Best Practices

1. **SSD Storage**: Use SSD for SWAP when possible
2. **Separate Disk**: Place SWAP on different disk than root filesystem
3. **Monitor Usage**: Regular monitoring prevents performance issues
4. **Optimize Swappiness**: Tune based on application requirements
5. **Regular Maintenance**: Clean and optimize SWAP periodically

### Monitoring and Maintenance

#### Create Monitoring Script

```bash
#!/bin/bash
# /usr/local/bin/swap-monitor.sh

SWAP_THRESHOLD=80  # Alert when SWAP usage exceeds 80%

SWAP_USED=$(free | grep Swap | awk '{print $3}')
SWAP_TOTAL=$(free | grep Swap | awk '{print $2}')

if [ $SWAP_TOTAL -gt 0 ]; then
    SWAP_PERCENT=$(( SWAP_USED * 100 / SWAP_TOTAL ))
    
    if [ $SWAP_PERCENT -gt $SWAP_THRESHOLD ]; then
        echo "WARNING: SWAP usage is ${SWAP_PERCENT}%"
        echo "Consider investigating high memory usage processes"
        
        # Log to syslog
        logger "SWAP usage high: ${SWAP_PERCENT}%"
        
        # Optional: Send email alert
        # echo "SWAP usage is ${SWAP_PERCENT}%" | mail -s "High SWAP Usage Alert" admin@example.com
    fi
fi
```

#### Schedule Regular Monitoring

```bash
# Add to crontab for hourly checks
sudo crontab -e

# Add this line:
0 * * * * /usr/local/bin/swap-monitor.sh
```

## Distribution-Specific Considerations

### CentOS/AlmaLinux Specific

#### Package Requirements

```bash
# Install required tools
sudo yum install util-linux procps-ng

# For CentOS 8/AlmaLinux
sudo dnf install util-linux procps-ng
```

#### Service Management

```bash
# Check SWAP service status
sudo systemctl status dev-swapfile.swap

# Enable SWAP service
sudo systemctl enable dev-swapfile.swap
```

### Ubuntu Specific

#### Package Requirements

```bash
# Install monitoring tools
sudo apt update
sudo apt install sysstat htop

# For advanced SWAP management
sudo apt install dphys-swapfile
```

#### Ubuntu Cloud Images

```bash
# Cloud images often have small SWAP, increase if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Conclusion

SWAP memory is an essential component for stable Linux system operation, especially in environments with limited physical RAM. Proper SWAP configuration ensures system stability, prevents out-of-memory errors, and provides a safety net for memory-intensive applications.

### Key Benefits of Proper SWAP Configuration

- **System Stability**: Prevents crashes due to memory exhaustion
- **Performance Optimization**: Allows better memory management
- **Application Support**: Enables hibernation and large application support
- **Cost Effectiveness**: Extends usable memory without hardware upgrades

### Recommended SWAP Setup Summary

| System Type | Recommended SWAP Size | Configuration |
|-------------|----------------------|---------------|
| **Desktop/Workstation** | Equal to RAM | File-based SWAP |
| **Server (< 8GB RAM)** | 1.5x to 2x RAM | Partition-based SWAP |
| **Server (> 8GB RAM)** | 2GB to 4GB | File-based SWAP |
| **Cloud/VPS** | 1GB to 2GB | File-based SWAP |

### Performance Impact

Well-configured SWAP provides:
- **Minimal Performance Impact**: When properly sized and tuned
- **System Resilience**: Protection against memory exhaustion
- **Better Resource Utilization**: Optimal use of available resources
- **Application Stability**: Support for memory-intensive workloads

Regular monitoring, proper sizing, and performance tuning ensure that SWAP enhances rather than hinders system performance. Whether running CentOS, AlmaLinux, or Ubuntu, following these guidelines will provide robust virtual memory management for your Linux systems.

Remember to monitor SWAP usage regularly and adjust configuration based on actual system requirements and usage patterns. With proper implementation, SWAP memory becomes a valuable tool for maintaining system performance and stability. 