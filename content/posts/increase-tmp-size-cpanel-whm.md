---
title: "How to Safely Increase /tmp Size on cPanel/WHM Servers"
slug: "increase-tmp-size-cpanel-whm-linux-filesystem"
excerpt: "Step-by-step guide to increasing the /tmp partition size on cPanel/WHM servers. Prevent errors, improve performance, and keep your Linux filesystem healthy."
published: true
publishedAt: "2024-12-10T10:00:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
category: "System Administration"
tags: ["cpanel", "whm", "linux", "tmp", "filesystem", "partition", "server management", "sysadmin", "troubleshooting"]
seo:
  title: "How to Safely Increase /tmp Size on cPanel/WHM (2024 Guide)"
  description: "Learn how to increase the /tmp partition size on cPanel/WHM servers. Step-by-step instructions for editing /etc/fstab, remounting, and troubleshooting."
  keywords: ["increase tmp size cpanel", "cpanel tmp full", "whm tmp partition", "linux tmp size", "resize tmp partition", "cpanel server management", "linux filesystem hierarchy"]
  canonical: "https://linux-id.net/posts/increase-tmp-size-cpanel-whm-linux-filesystem"
---

# How to Safely Increase /tmp Size on cPanel/WHM Servers

The `/tmp` directory is a temporary storage area used by Linux and many applications—including cPanel/WHM, MySQL, PHP, and backup tools. If `/tmp` runs out of space, you may experience failed uploads, backup errors, or even service interruptions. Increasing the `/tmp` partition size is a common and safe way to prevent these issues.

> **Warning:** Modifying `/etc/fstab` and remounting `/tmp` affects your server's filesystem. Always back up your data and, if possible, test changes on a staging server before applying to production.

## Why Increase /tmp Size?
- Prevents errors with uploads, backups, and temporary files
- Avoids service interruptions for MySQL, PHP, and other applications
- Improves overall server stability and performance

## Step-by-Step Guide to Increase /tmp Size

### 1. Check Current /tmp Usage
Before making changes, check how much space `/tmp` is using and whether it's full:
```bash
df -h /tmp
```

### 2. Edit `/etc/fstab`
Open the file in your preferred editor:
```bash
sudo nano /etc/fstab
```
Find the line for `/tmp`, for example:
```
tmpfs  /tmp  tmpfs  defaults,noauto  0  0
```
Add or update the `size` option (e.g., `size=4G`):
```
tmpfs  /tmp  tmpfs  defaults,size=4G  0  0
```
> **Tip:** Adjust `4G` to your needs and available RAM. `/tmp` is often mounted as `tmpfs` (RAM-backed), so don't set it larger than your server can handle.

### 3. Reload Systemd Daemon
Apply changes to systemd:
```bash
sudo systemctl daemon-reload
```

### 4. Remount /tmp
Remount the `/tmp` partition to apply the new size:
```bash
sudo mount -o remount /tmp
```

### 5. Verify the Change
Check the new size:
```bash
df -h /tmp
```

### 6. Troubleshooting
- If the new size is not applied, try rebooting the server:
  ```bash
  sudo reboot
  ```
- Double-check for typos in `/etc/fstab`—a mistake can prevent your system from booting.
- If `/tmp` is not mounted as `tmpfs`, consult your hosting provider or sysadmin for the best resizing method.

## Best Practices
- **Backup First:** Always back up important data before editing `/etc/fstab`.
- **Monitor Usage:** Regularly monitor `/tmp` usage to prevent future issues.
- **Avoid Oversizing:** Don't set `/tmp` to an excessively large size that could impact RAM or system performance.
- **Security:** Never set `/tmp` permissions to `777` or allow world-writable access.

## Conclusion
Increasing the `/tmp` size on cPanel/WHM is a straightforward process that can prevent common server errors and improve reliability. By following these steps and best practices, you can keep your Linux filesystem healthy and your hosting environment running smoothly.