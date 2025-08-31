---
title: "How to Change Hostname on Ubuntu 24.04"
slug: "change-hostname-on-ubuntu-24-04"
excerpt: "Learn how to change hostname on Ubuntu 24.04 using multiple methods including hostnamectl command, configuration files, and GUI. Complete guide with examples, best practices, and troubleshooting tips."
published: true
publishedAt: "2024-06-15T10:30:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
category: "System Administration"
tags: ["ubuntu", "hostname", "system-administration", "linux", "networking", "ubuntu-24-04"]
seo:
  title: "How to Change Hostname on Ubuntu 24.04: Complete Step-by-Step Guide"
  description: "Learn how to change hostname on Ubuntu 24.04 using multiple methods including hostnamectl command, configuration files, and GUI. Complete guide with examples, best practices, and troubleshooting tips."
  keywords: ["ubuntu 24.04 hostname", "change hostname ubuntu", "hostnamectl ubuntu", "ubuntu system administration", "linux hostname", "ubuntu networking", "FQDN ubuntu"]
  canonical: "https://linux-id.net/posts/change-hostname-on-ubuntu-24-04"
---

Hostname is a unique name computer in a network for identity between one computer to another computer. Each computer/server is connected on the network must have a different name for hostname and the hostname must be FQDN (Fully Qualified Domain Name).

In this comprehensive guide, we'll walk you through multiple methods to change the hostname on Ubuntu 24.04, including command-line tools, configuration file editing, and GUI methods. Whether you're managing a single server or multiple systems, understanding hostname management is essential for effective system administration.

## Understanding Hostnames in Ubuntu 24.04

### Types of Hostnames

Ubuntu 24.04 manages three types of hostnames:

1. **Static Hostname**: The traditional hostname stored in `/etc/hostname`
2. **Transient Hostname**: A dynamic hostname that can be changed at runtime
3. **Pretty Hostname**: A free-form UTF-8 hostname for presentation purposes

### Hostname Requirements and Best Practices

- **Length**: Maximum 63 characters per label, 253 characters total for FQDN
- **Characters**: Letters (a-z, A-Z), numbers (0-9), and hyphens (-)
- **Format**: Cannot start or end with a hyphen
- **Case**: Case-insensitive but conventionally lowercase
- **FQDN**: Recommended format: `hostname.domain.tld`

## Checking Your Current Hostname

Before changing the hostname, it's important to know your current configuration. Ubuntu 24.04 provides several methods to display hostname information.

### Using hostnamectl (Recommended)

The `hostnamectl` command is the modern systemd way to manage hostnames:

```bash
hostnamectl
```

**Example output:**
```bash
$ hostnamectl
 Static hostname: ubuntu-server
       Icon name: computer-vm
         Chassis: vm
      Machine ID: 7830927c3bc24254a018fea5372f9294
         Boot ID: fcb05de2afa742ca9b527612ab56f1c1
  Virtualization: kvm
Operating System: Ubuntu 24.04 LTS
          Kernel: Linux 6.8.0-31-generic
    Architecture: x86-64
 Hardware Vendor: QEMU
  Hardware Model: Standard PC (i440FX + PIIX, 1996)
```

### Alternative Methods

```bash
# Display static hostname
hostname

# Display FQDN
hostname -f

# Display all configured hostnames
hostname -A

# Display short hostname
hostname -s

# Display domain name
hostname -d
```

## Method 1: Changing Hostname Using hostnamectl (Recommended)

The `hostnamectl` command is the preferred method for changing hostnames in Ubuntu 24.04 as it's part of systemd and provides comprehensive hostname management.

### Basic Hostname Change

To change the hostname immediately without requiring a reboot:

```bash
sudo hostnamectl set-hostname new-hostname
```

**Example:**
```bash
sudo hostnamectl set-hostname webserver.linux-id.net
```

### Setting Different Hostname Types

```bash
# Set static hostname
sudo hostnamectl set-hostname webserver.linux-id.net

# Set pretty hostname
sudo hostnamectl set-hostname "Web Server - Production" --pretty

# Set transient hostname
sudo hostnamectl set-hostname temp-server --transient
```

### Verification

After changing the hostname, verify the changes:

```bash
hostnamectl status
```

**Expected output:**
```bash
$ hostnamectl status
 Static hostname: webserver.linux-id.net
 Pretty hostname: Web Server - Production
       Icon name: computer-vm
         Chassis: vm
      Machine ID: 7830927c3bc24254a018fea5372f9294
         Boot ID: fcb05de2afa742ca9b527612ab56f1c1
  Virtualization: kvm
Operating System: Ubuntu 24.04 LTS
          Kernel: Linux 6.8.0-31-generic
    Architecture: x86-64
```

## Method 2: Editing Configuration Files

For users who prefer manual configuration or need to understand the underlying system files, you can edit the hostname configuration files directly.

### Editing /etc/hostname

The `/etc/hostname` file contains the static hostname:

```bash
sudo nano /etc/hostname
```

Replace the existing content with your new hostname:

```
webserver.linux-id.net
```

### Updating /etc/hosts

The `/etc/hosts` file maps hostnames to IP addresses and should be updated to reflect the new hostname:

```bash
sudo nano /etc/hosts
```

Update the file to include your new hostname:

```
127.0.0.1       localhost
127.0.1.1       webserver.linux-id.net webserver
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
```

**Important notes:**
- The `127.0.1.1` entry is Ubuntu-specific and maps to your hostname
- Include both FQDN and short hostname for compatibility
- The `::1` entry is for IPv6 localhost

### Applying Changes

After editing configuration files, you have two options:

**Option 1: Reboot the system**
```bash
sudo reboot
```

**Option 2: Reload hostname without reboot**
```bash
sudo systemctl restart systemd-hostnamed
sudo hostname -F /etc/hostname
```

## Method 3: Using the GUI (Ubuntu Desktop)

For Ubuntu 24.04 desktop users, you can change the hostname through the graphical interface:

### Using Settings Application

1. **Open Settings**: Click on the gear icon in the top-right corner or search for "Settings"
2. **Navigate to About**: Click on "About" in the left sidebar
3. **Edit Device Name**: Click on "Device Name" field
4. **Enter New Hostname**: Type your desired hostname
5. **Apply Changes**: Click "Rename" to confirm

### Using GNOME Control Center

1. **Open Activities**: Press the Super key
2. **Search for "Details"**: Type "details" and open the application
3. **Click on Device Name**: Edit the hostname field
4. **Save Changes**: The change takes effect immediately

## Advanced Hostname Management

### Setting Hostname with Cloud-Init

For cloud instances, you can set the hostname using cloud-init configuration:

```yaml
# /etc/cloud/cloud.cfg.d/99-hostname.cfg
hostname: webserver
fqdn: webserver.linux-id.net
manage_etc_hosts: true
```

### Temporary Hostname Change

To change the hostname temporarily (until next reboot):

```bash
sudo hostname temp-hostname
```

### Hostname in Network Configuration

For systems using Netplan (Ubuntu 24.04 default), you can set the hostname in network configuration:

```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
      hostname: webserver.linux-id.net
```

## Troubleshooting Common Issues

### Hostname Not Updating

If the hostname doesn't update properly:

1. **Check systemd-hostnamed service:**
   ```bash
   sudo systemctl status systemd-hostnamed
   sudo systemctl restart systemd-hostnamed
   ```

2. **Verify file permissions:**
   ```bash
   ls -la /etc/hostname /etc/hosts
   ```

3. **Check for conflicting configurations:**
   ```bash
   grep -r "hostname" /etc/cloud/
   ```

### DNS Resolution Issues

If you experience DNS resolution problems after changing hostname:

1. **Update /etc/hosts properly:**
   ```bash
   127.0.1.1 new-hostname.domain.com new-hostname
   ```

2. **Restart networking services:**
   ```bash
   sudo systemctl restart systemd-resolved
   sudo systemctl restart networking
   ```

3. **Flush DNS cache:**
   ```bash
   sudo systemd-resolve --flush-caches
   ```

### SSH Connection Issues

After changing hostname, SSH connections might fail:

1. **Update SSH client configuration:**
   ```bash
   # ~/.ssh/config
   Host webserver
       HostName webserver.linux-id.net
       User username
   ```

2. **Clear SSH known_hosts:**
   ```bash
   ssh-keygen -R old-hostname
   ssh-keygen -R new-hostname
   ```

## Best Practices for Hostname Management

### 1. Planning and Documentation

- **Use descriptive names**: Include purpose, environment, or location
- **Follow naming conventions**: Establish consistent patterns
- **Document changes**: Keep records of hostname changes
- **Consider automation**: Use configuration management tools

### 2. Security Considerations

- **Avoid sensitive information**: Don't include passwords or keys
- **Use standard formats**: Stick to RFC-compliant naming
- **Regular audits**: Review hostname configurations periodically

### 3. Network Integration

- **Update DNS records**: Ensure DNS reflects hostname changes
- **Coordinate with DHCP**: Update DHCP reservations if needed
- **Monitor services**: Check that services adapt to hostname changes

### 4. Backup and Recovery

- **Backup configurations**: Save `/etc/hostname` and `/etc/hosts`
- **Test procedures**: Verify hostname change procedures in test environments
- **Rollback plans**: Have procedures to revert changes if needed

## Verification and Testing

After changing the hostname, perform these verification steps:

### Basic Verification

```bash
# Check all hostname types
hostnamectl

# Verify FQDN resolution
hostname -f

# Test local resolution
ping $(hostname)

# Check system logs
journalctl -u systemd-hostnamed
```

### Network Verification

```bash
# Test DNS resolution
nslookup $(hostname)

# Check network connectivity
ping -c 4 google.com

# Verify SSH access (from another machine)
ssh username@new-hostname
```

### Service Verification

```bash
# Check critical services
sudo systemctl status ssh
sudo systemctl status networking
sudo systemctl status systemd-resolved

# Verify log entries
tail -f /var/log/syslog | grep hostname
```

## Automation and Scripting

### Bash Script for Hostname Change

```bash
#!/bin/bash
# hostname-change.sh

NEW_HOSTNAME="$1"

if [ -z "$NEW_HOSTNAME" ]; then
    echo "Usage: $0 <new-hostname>"
    exit 1
fi

# Backup current configuration
sudo cp /etc/hostname /etc/hostname.backup
sudo cp /etc/hosts /etc/hosts.backup

# Set new hostname
sudo hostnamectl set-hostname "$NEW_HOSTNAME"

# Update /etc/hosts
sudo sed -i "s/127\.0\.1\.1.*/127.0.1.1\t$NEW_HOSTNAME/" /etc/hosts

# Restart services
sudo systemctl restart systemd-hostnamed

echo "Hostname changed to: $NEW_HOSTNAME"
echo "Please verify with: hostnamectl"
```

### Ansible Playbook

```yaml
---
- name: Change hostname on Ubuntu 24.04
  hosts: ubuntu_servers
  become: yes
  vars:
    new_hostname: "{{ inventory_hostname }}"
  
  tasks:
    - name: Set hostname
      hostname:
        name: "{{ new_hostname }}"
    
    - name: Update /etc/hosts
      lineinfile:
        path: /etc/hosts
        regexp: '^127\.0\.1\.1'
        line: "127.0.1.1 {{ new_hostname }}"
        backup: yes
    
    - name: Restart systemd-hostnamed
      systemd:
        name: systemd-hostnamed
        state: restarted
```

## Conclusion

Changing the hostname on Ubuntu 24.04 is a straightforward process that can be accomplished through multiple methods. The `hostnamectl` command is the recommended approach as it provides comprehensive hostname management and integrates well with systemd.

### Key Takeaways:

- **Use hostnamectl**: The modern, systemd-integrated method for hostname management
- **Update both files**: Ensure both `/etc/hostname` and `/etc/hosts` are properly configured
- **Follow best practices**: Use descriptive, RFC-compliant hostnames
- **Test thoroughly**: Verify network connectivity and service functionality after changes
- **Document changes**: Keep records for troubleshooting and auditing

### When to Change Hostnames:

- Setting up new servers or workstations
- Migrating systems to new environments
- Implementing naming conventions
- Preparing systems for domain integration
- Organizing infrastructure for better management

By following this guide, you'll be able to effectively manage hostnames on Ubuntu 24.04, ensuring proper network identification and seamless system administration. Remember to always test hostname changes in a non-production environment first and maintain proper documentation of your system configurations.