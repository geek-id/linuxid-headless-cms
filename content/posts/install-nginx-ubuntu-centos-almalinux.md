---
title: "Install Nginx on Ubuntu, CentOS, RHEL, and AlmaLinux"
slug: "install-nginx-ubuntu-centos-almalinux"
excerpt: "Complete guide to installing and configuring Nginx web server on Ubuntu, CentOS, RHEL, and AlmaLinux systems. Learn step-by-step installation procedures, basic configuration, security hardening, and performance optimization."
published: true
publishedAt: "2021-04-10T10:30:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "Web Server"
tags: ["nginx", "ubuntu", "centos", "rhel", "almalinux", "web-server", "tutorial", "installation"]
seo:
  title: "Install Nginx on Ubuntu, CentOS, RHEL, and AlmaLinux - Complete Guide"
  description: "Learn how to install and configure Nginx web server on Ubuntu, CentOS, RHEL, and AlmaLinux. Complete guide covering installation, configuration, security, and optimization."
  keywords: ["install nginx", "nginx ubuntu", "nginx centos", "nginx rhel", "nginx almalinux", "web server", "nginx configuration"]
  canonical: "https://linux-id.net/posts/install-nginx-ubuntu-centos-almalinux"
---

**Nginx (pronounced "engine-x")** is a high-performance, open-source web server and reverse proxy server known for its stability, rich feature set, simple configuration, and low resource consumption. Originally developed by Igor Sysoev in 2004, Nginx has become one of the most popular web servers worldwide, powering millions of websites including high-traffic sites like Netflix, Dropbox, and WordPress.com.

This comprehensive guide provides step-by-step instructions for installing and configuring Nginx on **Ubuntu**, **CentOS**, **RHEL**, and **AlmaLinux** systems. Whether you're setting up a development environment or deploying a production server, this tutorial covers everything you need to know.

## What is Nginx?

**Nginx (Engine-X)** is a powerful, open-source web server that also functions as a reverse proxy, load balancer, mail proxy, and HTTP cache. Unlike traditional web servers that use a threaded or process-based architecture, Nginx uses an asynchronous, event-driven architecture that enables it to handle thousands of concurrent connections with minimal memory usage.

### Key Features of Nginx

- **High Performance**: Capable of handling over 10,000 concurrent connections
- **Low Memory Usage**: Efficient memory management with predictable resource consumption
- **Reverse Proxy**: Can act as a proxy server for HTTP, HTTPS, SMTP, POP3, and IMAP protocols
- **Load Balancing**: Distributes incoming requests across multiple backend servers
- **SSL/TLS Termination**: Handles SSL encryption and decryption
- **Static Content Serving**: Optimized for serving static files (images, CSS, JavaScript)
- **Caching**: Built-in content caching capabilities
- **Modular Architecture**: Extensive module ecosystem for additional functionality

### Nginx vs Apache

| Feature | Nginx | Apache |
|---------|-------|--------|
| **Architecture** | Event-driven, asynchronous | Process/thread-based |
| **Memory Usage** | Low | Higher |
| **Static Content** | Excellent | Good |
| **Dynamic Content** | Requires PHP-FPM | Built-in PHP module |
| **Configuration** | Simple, readable | Complex |
| **Modules** | Compiled-in | Dynamic loading |

## Prerequisites

Before installing Nginx, ensure your system meets the following requirements:

### System Requirements
- **Ubuntu**: 18.04 LTS, 20.04 LTS, or 22.04 LTS
- **CentOS**: Version 7, 8, or Stream
- **RHEL**: Version 7, 8, or 9
- **AlmaLinux**: Version 8 or 9
- **Root or sudo access**: Administrative privileges required
- **Internet connection**: For downloading packages

### Recommended Specifications
- **RAM**: Minimum 512MB (1GB+ recommended for production)
- **Storage**: At least 1GB free space
- **CPU**: Any modern x86_64 processor

## Installing Nginx on Ubuntu

### Method 1: Installing from Default Repository

Ubuntu's default repositories include stable versions of Nginx:

#### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Nginx

```bash
sudo apt install nginx -y
```

#### Step 3: Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 4: Verify Installation

```bash
sudo systemctl status nginx
```

### Method 2: Installing from Official Nginx Repository

For the latest stable version, use the official Nginx repository:

#### Step 1: Install Prerequisites

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release -y
```

#### Step 2: Add Nginx Signing Key

```bash
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo gpg --dearmor -o /usr/share/keyrings/nginx-archive-keyring.gpg
```

#### Step 3: Add Nginx Repository

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

#### Step 4: Update and Install

```bash
sudo apt update
sudo apt install nginx -y
```

### Configuring Firewall on Ubuntu

```bash
# Allow Nginx through UFW firewall
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## Installing Nginx on CentOS/RHEL/AlmaLinux

### For CentOS 7 / RHEL 7

#### Step 1: Enable EPEL Repository

```bash
sudo yum install epel-release -y
sudo yum update -y
```

#### Step 2: Install Nginx

```bash
sudo yum install nginx -y
```

#### Step 3: Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### For CentOS 8 / RHEL 8 / AlmaLinux 8

#### Step 1: Enable PowerTools Repository (if needed)

```bash
# For CentOS 8
sudo dnf config-manager --set-enabled powertools

# For RHEL 8
sudo subscription-manager repos --enable codeready-builder-for-rhel-8-x86_64-rpms

# For AlmaLinux 8
sudo dnf config-manager --set-enabled powertools
```

#### Step 2: Install Nginx

```bash
sudo dnf install nginx -y
```

#### Step 3: Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### For CentOS Stream / RHEL 9 / AlmaLinux 9

#### Step 1: Install Nginx

```bash
sudo dnf install nginx -y
```

#### Step 2: Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configuring Firewall on CentOS/RHEL/AlmaLinux

```bash
# For firewalld (default on CentOS/RHEL/AlmaLinux)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Verify firewall rules
sudo firewall-cmd --list-all
```

### SELinux Configuration

If SELinux is enabled, configure it for Nginx:

```bash
# Check SELinux status
sestatus

# Allow Nginx to bind to network ports
sudo setsebool -P httpd_can_network_connect 1

# Set SELinux context for web content
sudo setsebool -P httpd_can_network_relay 1
```

## Basic Nginx Configuration

### Understanding Nginx Directory Structure

#### Ubuntu Directory Structure
```
/etc/nginx/                 # Main configuration directory
├── nginx.conf             # Main configuration file
├── sites-available/       # Available virtual host configurations
├── sites-enabled/         # Enabled virtual host configurations (symlinks)
├── conf.d/                # Additional configuration files
└── snippets/              # Configuration snippets
```

#### CentOS/RHEL/AlmaLinux Directory Structure
```
/etc/nginx/                 # Main configuration directory
├── nginx.conf             # Main configuration file
├── conf.d/                # Virtual host configurations
└── default.d/             # Default configuration files
```

### Basic Configuration File

Edit the main Nginx configuration file:

```bash
# Ubuntu
sudo nano /etc/nginx/nginx.conf

# CentOS/RHEL/AlmaLinux
sudo nano /etc/nginx/nginx.conf
```

### Essential Configuration Settings

```nginx
# /etc/nginx/nginx.conf

user nginx;  # or www-data on Ubuntu
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript 
               text/xml application/xml application/xml+rss text/javascript;

    # Include virtual host configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;  # Ubuntu only
}
```

### Creating a Simple Virtual Host

#### For Ubuntu

Create a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### For CentOS/RHEL/AlmaLinux

Create a new site configuration:

```bash
sudo nano /etc/nginx/conf.d/example.com.conf
```

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name example.com www.example.com;
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Testing Nginx Installation

### Create a Test HTML Page

```bash
# Ubuntu
sudo mkdir -p /var/www/example.com
sudo nano /var/www/example.com/index.html

# CentOS/RHEL/AlmaLinux
sudo nano /usr/share/nginx/html/index.html
```

Add the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Nginx!</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #333; }
        p { color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Nginx!</h1>
        <p>If you can see this page, Nginx is successfully installed and running.</p>
        <p>Server: Ubuntu/CentOS/RHEL/AlmaLinux</p>
    </div>
</body>
</html>
```

### Verify Installation

Test the configuration and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Access your server through a web browser:
```
http://your-server-ip
http://your-domain.com
```

## Security Hardening

### SSL/TLS Configuration

#### Install Certbot for Let's Encrypt

```bash
# Ubuntu
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL/AlmaLinux
sudo dnf install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

### Security Headers Configuration

Create a security configuration snippet:

```bash
sudo nano /etc/nginx/snippets/security-headers.conf
```

```nginx
# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
add_header Referrer-Policy "strict-origin-when-cross-origin";

# Hide Nginx version
server_tokens off;
```

Include in your virtual host:

```nginx
server {
    # ... other configuration ...
    
    include /etc/nginx/snippets/security-headers.conf;
}
```

### Rate Limiting

Add rate limiting to prevent abuse:

```nginx
# In http block
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# In server block
location /login {
    limit_req zone=login burst=5 delay=3;
    # ... other configuration ...
}
```

## Performance Optimization

### Worker Process Optimization

```nginx
# Optimize worker processes
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}
```

### Caching Configuration

```nginx
# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/rss+xml
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/svg+xml
    image/x-icon
    text/css
    text/plain
    text/x-component;
```

## Troubleshooting Common Issues

### Issue 1: Nginx Fails to Start

**Symptoms**: Service fails to start or stops immediately

**Solutions**:

```bash
# Check syntax errors
sudo nginx -t

# Check port conflicts
sudo netstat -tlnp | grep :80

# Check error logs
sudo journalctl -u nginx
sudo tail -f /var/log/nginx/error.log
```

### Issue 2: Permission Denied Errors

**Solutions**:

```bash
# Check file permissions
sudo chown -R nginx:nginx /usr/share/nginx/html  # CentOS/RHEL/AlmaLinux
sudo chown -R www-data:www-data /var/www/html    # Ubuntu

# Set correct permissions
sudo chmod -R 755 /var/www/html
sudo chmod -R 644 /var/www/html/*.html
```

### Issue 3: SELinux Issues (CentOS/RHEL/AlmaLinux)

**Solutions**:

```bash
# Check SELinux denials
sudo ausearch -m AVC -ts recent

# Set appropriate SELinux contexts
sudo restorecon -Rv /usr/share/nginx/html/

# Allow Nginx to serve content
sudo setsebool -P httpd_can_network_connect 1
```

### Issue 4: Firewall Blocking Connections

**Solutions**:

```bash
# Ubuntu (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL/AlmaLinux (firewalld)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## Monitoring and Maintenance

### Log Management

Configure log rotation:

```bash
sudo nano /etc/logrotate.d/nginx
```

```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### Monitoring Commands

```bash
# Check Nginx status
sudo systemctl status nginx

# View real-time access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log

# Check configuration syntax
sudo nginx -t

# Reload configuration without downtime
sudo systemctl reload nginx
```

### Performance Monitoring

```bash
# Check active connections
curl -s http://localhost/nginx_status

# Monitor system resources
htop
iostat -x 1
```

## Updating Nginx

### Ubuntu

```bash
sudo apt update && sudo apt upgrade nginx
```

### CentOS/RHEL/AlmaLinux

```bash
# CentOS/RHEL 7
sudo yum update nginx

# CentOS/RHEL 8+/AlmaLinux
sudo dnf update nginx
```

## Conclusion

Nginx is a powerful and versatile web server that offers excellent performance, security, and flexibility. This comprehensive guide has walked you through installing and configuring Nginx on Ubuntu, CentOS, RHEL, and AlmaLinux systems.

### Key Takeaways

- **Installation varies by distribution** but follows similar patterns
- **Proper configuration** is essential for security and performance
- **Security hardening** should be implemented from the start
- **Regular maintenance** ensures optimal performance and security

### Next Steps

After successfully installing Nginx, consider:

1. **Setting up SSL/TLS certificates** with Let's Encrypt
2. **Configuring reverse proxy** for backend applications
3. **Implementing load balancing** for multiple servers
4. **Setting up monitoring** with tools like Prometheus or Grafana
5. **Learning advanced features** like rate limiting and caching

Whether you're hosting a simple static website or a complex web application, Nginx provides the foundation for reliable, high-performance web services. With the knowledge gained from this guide, you're ready to deploy and manage Nginx on your preferred Linux distribution.