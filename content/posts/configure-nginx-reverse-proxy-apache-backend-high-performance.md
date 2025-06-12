---
title: "Configure Nginx Reverse Proxy with Apache Backend Server for High Performance Web Hosting"
slug: "configure-nginx-reverse-proxy-apache-backend-high-performance"
excerpt: "Learn how to configure Nginx as a reverse proxy with Apache backend for improved performance and scalability. Complete guide covering installation, SSL setup, load balancing, and optimization techniques."
published: true
publishedAt: "2021-02-18T09:00:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "System Administration"
tags: ["nginx", "apache", "reverse-proxy", "web-server", "load-balancing", "ssl", "performance", "linux"]
seo:
  title: "Configure Nginx Reverse Proxy with Apache Backend Server"
  description: "Complete step-by-step tutorial to configure Nginx reverse proxy with Apache backend server. Includes SSL termination, load balancing, performance optimization, and security best practices."
  keywords: ["nginx reverse proxy apache backend", "configure nginx apache reverse proxy", "nginx apache backend server setup", "reverse proxy configuration tutorial", "nginx apache load balancing", "web server performance optimization"]
  canonical: "https://linux-id.net/posts/configure-nginx-reverse-proxy-apache-backend-high-performance"
---

Setting up **Nginx as a reverse proxy** with **Apache backend** is a powerful architecture that combines the best of both web servers. This configuration leverages Nginx's excellent performance for static content and SSL termination while utilizing Apache's robust module ecosystem and .htaccess support for dynamic content processing.

This comprehensive guide covers the complete setup process, from basic configuration to advanced optimization techniques for production environments.

## Understanding Nginx Reverse Proxy Architecture

### What is a Reverse Proxy?

A **reverse proxy** sits between clients and backend servers, forwarding client requests to appropriate backend servers and returning responses back to clients. Unlike a forward proxy that acts on behalf of clients, a reverse proxy acts on behalf of servers.

### Benefits of Nginx + Apache Architecture

| Component | Role | Advantages |
|-----------|------|------------|
| **Nginx (Frontend)** | Reverse Proxy | Fast static content delivery, SSL termination, load balancing |
| **Apache (Backend)** | Application Server | Rich module ecosystem, .htaccess support, PHP processing |

### Architecture Overview

```
Client Request → Nginx (Port 80/443) → Apache (Port 8080) → Response
```

**Key Benefits:**
- **Performance**: Nginx handles static files and SSL efficiently
- **Scalability**: Easy horizontal scaling with multiple Apache backends
- **Security**: Nginx acts as a security layer protecting Apache
- **Flexibility**: Combine strengths of both web servers
- **Resource Optimization**: Better memory and CPU utilization

## Prerequisites and System Requirements

### System Requirements
- **Operating System**: Ubuntu 20.04 LTS, CentOS 8, or RHEL 8
- **Memory**: Minimum 2GB RAM (4GB+ recommended for production)
- **CPU**: 2+ cores recommended
- **Storage**: At least 20GB available space
- **Network**: Static IP address for production environments

### Required Packages
- **Nginx**: Latest stable version (1.18+)
- **Apache**: Version 2.4+
- **SSL Certificates**: Let's Encrypt or commercial certificates
- **Firewall**: UFW (Ubuntu) or firewalld (CentOS/RHEL)

### Pre-installation Checklist
```bash
# Check system resources
free -h
df -h
nproc

# Verify network configuration
ip addr show
ss -tlnp | grep -E ':80|:443|:8080'

# Update system packages
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
sudo dnf update -y                      # CentOS/RHEL 8
```

## Installation Process

### Step 1: Install Nginx

#### Ubuntu/Debian Installation
```bash
# Update package repository
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
nginx -v
sudo systemctl status nginx
```

#### CentOS/RHEL Installation
```bash
# Install EPEL repository
sudo dnf install epel-release -y

# Install Nginx
sudo dnf install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
nginx -v
sudo systemctl status nginx
```

### Step 2: Install Apache

#### Ubuntu/Debian Installation
```bash
# Install Apache
sudo apt install apache2 -y

# Stop Apache (we'll configure it for backend use)
sudo systemctl stop apache2

# Verify installation
apache2 -v
```

#### CentOS/RHEL Installation
```bash
# Install Apache
sudo dnf install httpd -y

# Stop Apache
sudo systemctl stop httpd

# Verify installation
httpd -v
```

### Step 3: Configure Apache Backend

#### Change Apache Default Port
```bash
# Ubuntu/Debian
sudo nano /etc/apache2/ports.conf

# CentOS/RHEL
sudo nano /etc/httpd/conf/httpd.conf
```

**Edit ports.conf (Ubuntu/Debian):**
```apache
# Change from Listen 80 to:
Listen 8080

# If SSL is enabled, change from Listen 443 to:
Listen 8443
```

**Edit httpd.conf (CentOS/RHEL):**
```apache
# Change from Listen 80 to:
Listen 8080

# Add SSL port if needed:
Listen 8443
```

#### Configure Apache Virtual Host
```bash
# Ubuntu/Debian
sudo nano /etc/apache2/sites-available/backend.conf

# CentOS/RHEL
sudo nano /etc/httpd/conf.d/backend.conf
```

**Backend Virtual Host Configuration:**
```apache
<VirtualHost *:8080>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/html
    
    # Enable mod_rewrite
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/backend_error.log
    CustomLog ${APACHE_LOG_DIR}/backend_access.log combined
    
    # Security headers
    Header always set X-Backend-Server "Apache"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
</VirtualHost>
```

#### Enable Required Apache Modules
```bash
# Ubuntu/Debian
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo a2ensite backend.conf
sudo a2dissite 000-default.conf

# CentOS/RHEL (modules are typically enabled by default)
# Verify modules are loaded
sudo httpd -M | grep -E 'rewrite|headers|ssl'
```

#### Start Apache Backend
```bash
# Ubuntu/Debian
sudo systemctl start apache2
sudo systemctl enable apache2

# CentOS/RHEL
sudo systemctl start httpd
sudo systemctl enable httpd

# Verify Apache is running on port 8080
sudo ss -tlnp | grep :8080
```

## Nginx Reverse Proxy Configuration

### Step 1: Basic Nginx Configuration

#### Main Nginx Configuration
```bash
sudo nano /etc/nginx/nginx.conf
```

**Optimized nginx.conf:**
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# Optimize worker connections
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic settings
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Hide Nginx version
    server_tokens off;
    
    # Include virtual host configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Step 2: Create Reverse Proxy Virtual Host

```bash
# Ubuntu/Debian
sudo nano /etc/nginx/sites-available/reverse-proxy.conf

# CentOS/RHEL
sudo nano /etc/nginx/conf.d/reverse-proxy.conf
```

**Reverse Proxy Configuration:**
```nginx
# Upstream backend servers
upstream apache_backend {
    # Single backend server
    server 127.0.0.1:8080;
    
    # For multiple backend servers (load balancing)
    # server 127.0.0.1:8080 weight=3;
    # server 127.0.0.1:8081 weight=2;
    # server 127.0.0.1:8082 weight=1;
    
    # Health check and failover
    # server 127.0.0.1:8080 max_fails=3 fail_timeout=30s;
    
    # Keep connections alive
    keepalive 32;
}

# HTTP server block (redirect to HTTPS)
server {
    listen 80;
    server_name example.com www.example.com;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server block
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Document root for static files
    root /var/www/html;
    index index.php index.html index.htm;
    
    # Handle static files directly with Nginx
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Try to serve static files directly, fallback to Apache
        try_files $uri @apache;
    }
    
    # Handle PHP and dynamic content
    location ~ \.php$ {
        proxy_pass http://apache_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Proxy timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # Don't cache dynamic content
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }
    
    # Default location - proxy to Apache
    location / {
        try_files $uri $uri/ @apache;
    }
    
    # Apache backend proxy
    location @apache {
        proxy_pass http://apache_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Proxy timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Block access to Apache config files
    location ~ /\.ht {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Step 3: Enable and Test Configuration

#### Enable Site (Ubuntu/Debian)
```bash
sudo ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

#### Test Nginx Configuration
```bash
# Test configuration syntax
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended)

#### Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo dnf install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d example.com -d www.example.com

# Start Nginx
sudo systemctl start nginx

# Set up automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Update Nginx Configuration for Let's Encrypt
```bash
sudo nano /etc/nginx/sites-available/reverse-proxy.conf
```

**Update SSL paths:**
```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

### Option 2: Self-Signed Certificate (Development)

```bash
# Create SSL directory
sudo mkdir -p /etc/ssl/private

# Generate private key
sudo openssl genrsa -out /etc/ssl/private/example.com.key 2048

# Generate certificate
sudo openssl req -new -x509 -key /etc/ssl/private/example.com.key \
    -out /etc/ssl/certs/example.com.crt -days 365 \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=example.com"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/example.com.key
sudo chmod 644 /etc/ssl/certs/example.com.crt
```

## Firewall Configuration

### Ubuntu/Debian (UFW)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct access to Apache
sudo ufw deny 8080/tcp

# Check status
sudo ufw status
```

### CentOS/RHEL (firewalld)
```bash
# Start and enable firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Block direct access to Apache
sudo firewall-cmd --permanent --remove-port=8080/tcp

# Reload firewall
sudo firewall-cmd --reload

# Check status
sudo firewall-cmd --list-all
```

## Performance Optimization

### Nginx Caching Configuration

#### Create Cache Directory
```bash
sudo mkdir -p /var/cache/nginx/proxy
sudo chown nginx:nginx /var/cache/nginx/proxy
sudo chmod 755 /var/cache/nginx/proxy
```

#### Add Caching to Nginx Configuration
```nginx
# Add to http block in nginx.conf
proxy_cache_path /var/cache/nginx/proxy levels=1:2 keys_zone=my_cache:10m 
                 max_size=1g inactive=60m use_temp_path=off;

# Add to server block
location / {
    # Cache configuration
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    
    # Cache headers
    add_header X-Cache-Status $upstream_cache_status;
    
    # Existing proxy settings...
    proxy_pass http://apache_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Apache Backend Optimization

#### Configure Apache for Backend Use
```bash
# Ubuntu/Debian
sudo nano /etc/apache2/apache2.conf

# CentOS/RHEL
sudo nano /etc/httpd/conf/httpd.conf
```

**Apache Optimization:**
```apache
# Reduce memory usage
ServerLimit 4
MaxRequestWorkers 100
ThreadsPerChild 25

# Disable unnecessary modules
# LoadModule status_module modules/mod_status.so
# LoadModule info_module modules/mod_info.so

# Enable compression
LoadModule deflate_module modules/mod_deflate.so

<Location />
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI \
        \.(?:gif|jpe?g|png)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI \
        \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
</Location>

# Security: Hide server information
ServerTokens Prod
ServerSignature Off

# Disable server-status and server-info
<Location "/server-status">
    Require all denied
</Location>

<Location "/server-info">
    Require all denied
</Location>
```

## Load Balancing Configuration

### Multiple Apache Backend Servers

#### Configure Additional Apache Instances
```bash
# Copy Apache configuration for second instance
sudo cp -r /etc/apache2 /etc/apache2-8081  # Ubuntu/Debian
sudo cp -r /etc/httpd /etc/httpd-8081      # CentOS/RHEL

# Edit second instance configuration
sudo nano /etc/apache2-8081/ports.conf     # Ubuntu/Debian
sudo nano /etc/httpd-8081/conf/httpd.conf  # CentOS/RHEL

# Change port to 8081
Listen 8081

# Create systemd service for second instance
sudo nano /etc/systemd/system/apache2-8081.service
```

**Systemd Service File:**
```ini
[Unit]
Description=Apache HTTP Server (Instance 8081)
After=network.target

[Service]
Type=forking
ExecStart=/usr/sbin/apache2 -f /etc/apache2-8081/apache2.conf -DFOREGROUND
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

#### Update Nginx Upstream Configuration
```nginx
upstream apache_backend {
    # Load balancing methods
    # least_conn;  # Route to server with least connections
    # ip_hash;     # Route based on client IP
    
    server 127.0.0.1:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8081 weight=2 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8082 weight=1 max_fails=3 fail_timeout=30s backup;
    
    keepalive 32;
}
```

### Health Check Configuration

#### Nginx Health Check
```nginx
# Add to server block
location /nginx-health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}

# Backend health check
location /backend-health {
    proxy_pass http://apache_backend/server-status;
    proxy_set_header Host $host;
    access_log off;
}
```

#### Apache Health Check
```apache
# Enable mod_status for health checks
LoadModule status_module modules/mod_status.so

<Location "/server-status">
    SetHandler server-status
    Require ip 127.0.0.1
    Require ip ::1
</Location>
```

## Monitoring and Logging

### Nginx Monitoring

#### Custom Log Format
```nginx
# Add to nginx.conf http block
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'rt=$request_time uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" urt="$upstream_response_time" '
                   'cache="$upstream_cache_status"';

# Use in server block
access_log /var/log/nginx/detailed.log detailed;
```

#### Log Rotation
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/nginx-custom
```

**Logrotate Configuration:**
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

### Performance Monitoring Script

```bash
# Create monitoring script
sudo nano /usr/local/bin/nginx-apache-monitor.sh
```

**Monitoring Script:**
```bash
#!/bin/bash

LOG_FILE="/var/log/nginx-apache-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting monitoring check" >> $LOG_FILE

# Check Nginx status
if systemctl is-active --quiet nginx; then
    echo "[$DATE] Nginx: RUNNING" >> $LOG_FILE
else
    echo "[$DATE] Nginx: STOPPED - Attempting restart" >> $LOG_FILE
    systemctl restart nginx
fi

# Check Apache status
if systemctl is-active --quiet apache2 || systemctl is-active --quiet httpd; then
    echo "[$DATE] Apache: RUNNING" >> $LOG_FILE
else
    echo "[$DATE] Apache: STOPPED - Attempting restart" >> $LOG_FILE
    systemctl restart apache2 || systemctl restart httpd
fi

# Check backend connectivity
if curl -s http://127.0.0.1:8080 > /dev/null; then
    echo "[$DATE] Backend: ACCESSIBLE" >> $LOG_FILE
else
    echo "[$DATE] Backend: INACCESSIBLE" >> $LOG_FILE
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "[$DATE] WARNING: Disk usage at ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
echo "[$DATE] Memory usage: ${MEM_USAGE}%" >> $LOG_FILE

echo "[$DATE] Monitoring check completed" >> $LOG_FILE
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/nginx-apache-monitor.sh

# Add to crontab for regular monitoring
sudo crontab -e
# Add: */5 * * * * /usr/local/bin/nginx-apache-monitor.sh
```

## Troubleshooting Common Issues

### Issue 1: 502 Bad Gateway Error

**Symptoms:**
```
502 Bad Gateway
nginx/1.18.0
```

**Diagnosis:**
```bash
# Check if Apache is running
sudo systemctl status apache2  # Ubuntu/Debian
sudo systemctl status httpd    # CentOS/RHEL

# Check if Apache is listening on correct port
sudo ss -tlnp | grep :8080

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Apache error logs
sudo tail -f /var/log/apache2/error.log  # Ubuntu/Debian
sudo tail -f /var/log/httpd/error_log    # CentOS/RHEL
```

**Solutions:**
```bash
# Restart Apache
sudo systemctl restart apache2  # Ubuntu/Debian
sudo systemctl restart httpd    # CentOS/RHEL

# Check firewall rules
sudo ufw status                 # Ubuntu/Debian
sudo firewall-cmd --list-all    # CentOS/RHEL

# Verify upstream configuration
sudo nginx -t
```

### Issue 2: SSL Certificate Problems

**Symptoms:**
```
SSL_ERROR_BAD_CERT_DOMAIN
ERR_CERT_COMMON_NAME_INVALID
```

**Solutions:**
```bash
# Check certificate validity
sudo openssl x509 -in /etc/ssl/certs/example.com.crt -text -noout

# For Let's Encrypt certificates
sudo certbot certificates

# Renew Let's Encrypt certificate
sudo certbot renew --dry-run

# Check SSL configuration
sudo nginx -t
```

### Issue 3: Performance Issues

**Diagnosis:**
```bash
# Check server resources
htop
iotop
free -h
df -h

# Monitor connections
sudo ss -s
sudo netstat -an | grep :80 | wc -l

# Check Nginx status
curl http://localhost/nginx-health

# Monitor backend response times
curl -w "@curl-format.txt" -o /dev/null -s http://example.com/
```

**Create curl-format.txt:**
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

## Security Best Practices

### Nginx Security Configuration

```nginx
# Add to server block
# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /login {
    limit_req zone=login burst=5 nodelay;
    proxy_pass http://apache_backend;
}

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://apache_backend;
}

# Block common attack patterns
location ~* \.(php|asp|aspx|jsp)$ {
    if ($request_uri ~* "(union|select|insert|delete|drop|create|alter|exec|script)") {
        return 403;
    }
    proxy_pass http://apache_backend;
}

# Block suspicious user agents
if ($http_user_agent ~* (nmap|nikto|wikto|sf|sqlmap|bsqlbf|w3af|acunetix|havij|appscan)) {
    return 403;
}
```

### Apache Security Configuration

```apache
# Add to Apache configuration
# Hide Apache version
ServerTokens Prod
ServerSignature Off

# Disable unnecessary HTTP methods
<Location />
    <LimitExcept GET POST HEAD>
        Require all denied
    </LimitExcept>
</Location>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Disable server-info and server-status from external access
<Location "/server-info">
    Require ip 127.0.0.1
    Require ip ::1
</Location>

<Location "/server-status">
    Require ip 127.0.0.1
    Require ip ::1
</Location>
```

## Conclusion

Setting up **Nginx as a reverse proxy with Apache backend** provides a robust, scalable, and high-performance web server architecture. This configuration combines the strengths of both servers while providing excellent security and optimization opportunities.

### Key Benefits Achieved

- **Performance**: Nginx handles static content and SSL termination efficiently
- **Scalability**: Easy horizontal scaling with load balancing
- **Security**: Multiple layers of protection and security headers
- **Flexibility**: Support for both static and dynamic content
- **Monitoring**: Comprehensive logging and health checking

### Best Practices Summary

1. **Regular Updates**: Keep both Nginx and Apache updated
2. **Monitoring**: Implement comprehensive monitoring and alerting
3. **Security**: Regular security audits and configuration reviews
4. **Backup**: Regular configuration and SSL certificate backups
5. **Testing**: Test all changes in staging environment first

### Performance Optimization Checklist

- ✅ Enable Gzip compression
- ✅ Configure proper caching headers
- ✅ Implement proxy caching
- ✅ Optimize buffer sizes
- ✅ Enable HTTP/2
- ✅ Use keepalive connections
- ✅ Monitor and tune worker processes

### Security Checklist

- ✅ SSL/TLS encryption enabled
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Firewall properly configured
- ✅ Regular security updates
- ✅ Access logs monitored
- ✅ Unnecessary services disabled

This architecture provides a solid foundation for hosting modern web applications with excellent performance, security, and scalability characteristics. Regular monitoring and maintenance ensure optimal operation in production environments.

For advanced configurations and specific use cases, refer to the official documentation for [Nginx](https://nginx.org/en/docs/) and [Apache](https://httpd.apache.org/docs/) web servers. 