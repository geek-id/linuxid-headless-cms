---
title: "Configure Nginx Virtual Hosts for Multiple Websites on Single Server"
slug: "configure-nginx-virtual-hosts-multiple-sites"
excerpt: "Learn how to configure Nginx virtual hosts to host multiple websites on a single VPS server. Complete guide covering setup, configuration, security, and best practices for managing multiple domains efficiently."
published: true
publishedAt: "2021-04-18T09:15:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "Web Server"
tags: ["nginx", "virtual-host", "vps", "web-server", "multiple-websites", "domain-configuration", "server-management"]
seo:
  title: "Nginx Virtual Hosts: Host Multiple Websites on Single Server - Complete Guide"
  description: "Complete tutorial on configuring Nginx virtual hosts to run multiple websites on one VPS server. Includes setup, security, and optimization best practices."
  keywords: ["nginx virtual host", "multiple websites", "vps hosting", "nginx configuration", "domain hosting", "web server setup", "nginx server blocks"]
  canonical: "https://linux-id.net/posts/configure-nginx-virtual-hosts-multiple-sites"
---

**Virtual hosting** is a powerful feature that allows you to run multiple websites on a single server, each with its own domain name, configuration, and content directory. With Nginx virtual hosts (also called server blocks), you can efficiently manage multiple websites, reduce hosting costs, and maximize server resource utilization.

This comprehensive guide covers everything you need to know about configuring Nginx virtual hosts for hosting multiple websites on a single VPS server.

## What are Virtual Hosts?

**Virtual hosts** (or **server blocks** in Nginx terminology) are configurations that allow a single web server to host multiple websites or domains. Each virtual host can have its own:

- **Domain name** or subdomain
- **Document root** directory
- **SSL/TLS certificates**
- **Access and error logs**
- **Custom configurations**
- **PHP-FPM pools** (for PHP applications)

### Benefits of Virtual Hosts

| Benefit | Description |
|---------|-------------|
| **Cost Efficiency** | Host multiple websites on one server |
| **Resource Sharing** | Optimize server resource utilization |
| **Centralized Management** | Manage multiple sites from one location |
| **Scalability** | Easy to add new websites |
| **Flexibility** | Different configurations per site |

### Types of Virtual Hosting

1. **Name-based Virtual Hosting**: Multiple domains on one IP address
2. **IP-based Virtual Hosting**: Each domain has its own IP address
3. **Port-based Virtual Hosting**: Different ports for different sites

This guide focuses on **name-based virtual hosting**, which is the most common and practical approach.

## Prerequisites

Before configuring virtual hosts, ensure you have:

### System Requirements
- **VPS or Dedicated Server** with root access
- **Nginx** installed and running
- **PHP-FPM** (if hosting PHP applications)
- **Domain names** pointed to your server IP
- **Basic Linux command line** knowledge

### Recommended Setup
- **Operating System**: Ubuntu 20.04 LTS, CentOS 8, or newer
- **RAM**: Minimum 1GB (2GB+ for multiple sites)
- **Storage**: SSD with sufficient space for all websites
- **Bandwidth**: Adequate for expected traffic

## Understanding Nginx Directory Structure

### Ubuntu/Debian Structure
```
/etc/nginx/
├── nginx.conf                 # Main configuration file
├── sites-available/           # Available virtual host configurations
├── sites-enabled/             # Active virtual host configurations (symlinks)
├── conf.d/                    # Additional configuration files
├── snippets/                  # Reusable configuration snippets
└── modules-enabled/           # Enabled modules
```

### CentOS/RHEL Structure
```
/etc/nginx/
├── nginx.conf                 # Main configuration file
├── conf.d/                    # Virtual host configurations
├── default.d/                 # Default configuration snippets
└── modules.d/                 # Module configurations
```

## Step-by-Step Virtual Host Configuration

### Step 1: Configure Main Nginx Configuration

First, ensure your main Nginx configuration is properly set up to include virtual host files.

#### Edit nginx.conf

```bash
sudo nano /etc/nginx/nginx.conf
```

Ensure these lines are present in the `http` block:

```nginx
# /etc/nginx/nginx.conf

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript 
               text/xml application/xml application/xml+rss text/javascript;

    # Include virtual host configurations
    include /etc/nginx/conf.d/*.conf;           # CentOS/RHEL
    include /etc/nginx/sites-enabled/*;        # Ubuntu/Debian
}
```

### Step 2: Create Directory Structure for Websites

Create directories for each website you want to host:

```bash
# Create web directories
sudo mkdir -p /var/www/example1.com/public_html
sudo mkdir -p /var/www/example2.com/public_html
sudo mkdir -p /var/www/example3.com/public_html

# Create log directories
sudo mkdir -p /var/log/nginx/example1.com
sudo mkdir -p /var/log/nginx/example2.com
sudo mkdir -p /var/log/nginx/example3.com

# Set proper ownership
sudo chown -R www-data:www-data /var/www/  # Ubuntu/Debian
# sudo chown -R nginx:nginx /var/www/      # CentOS/RHEL

# Set proper permissions
sudo chmod -R 755 /var/www/
```

### Step 3: Create Test Content

Create simple test pages for each website:

#### Example 1: example1.com

```bash
sudo nano /var/www/example1.com/public_html/index.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Example1.com</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #333; }
        p { color: #666; }
        .site-info { background: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Example1.com</h1>
        <p>This is the first website hosted on this server.</p>
        <div class="site-info">
            <strong>Virtual Host:</strong> example1.com<br>
            <strong>Document Root:</strong> /var/www/example1.com/public_html<br>
            <strong>Server:</strong> Nginx
        </div>
    </div>
</body>
</html>
```

#### Example 2: example2.com

```bash
sudo nano /var/www/example2.com/public_html/index.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Example2.com</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; background: #f0f8ff; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #2c5aa0; }
        p { color: #444; }
        .site-info { background: #e6f3ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #2c5aa0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Example2.com</h1>
        <p>This is the second website hosted on this server.</p>
        <div class="site-info">
            <strong>Virtual Host:</strong> example2.com<br>
            <strong>Document Root:</strong> /var/www/example2.com/public_html<br>
            <strong>Server:</strong> Nginx
        </div>
    </div>
</body>
</html>
```

### Step 4: Create Virtual Host Configuration Files

#### Method A: Ubuntu/Debian (using sites-available and sites-enabled)

Create virtual host configuration in sites-available:

```bash
sudo nano /etc/nginx/sites-available/example1.com
```

```nginx
# Virtual Host for example1.com
server {
    listen 80;
    listen [::]:80;
    
    server_name example1.com www.example1.com;
    root /var/www/example1.com/public_html;
    index index.html index.htm index.php;

    # Logging
    access_log /var/log/nginx/example1.com/access.log;
    error_log /var/log/nginx/example1.com/error.log;

    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }

    # PHP processing (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

Create configuration for the second website:

```bash
sudo nano /etc/nginx/sites-available/example2.com
```

```nginx
# Virtual Host for example2.com
server {
    listen 80;
    listen [::]:80;
    
    server_name example2.com www.example2.com;
    root /var/www/example2.com/public_html;
    index index.html index.htm index.php;

    # Logging
    access_log /var/log/nginx/example2.com/access.log;
    error_log /var/log/nginx/example2.com/error.log;

    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }

    # PHP processing (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

Enable the virtual hosts:

```bash
# Create symbolic links to enable sites
sudo ln -s /etc/nginx/sites-available/example1.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/example2.com /etc/nginx/sites-enabled/

# Disable default site (optional)
sudo rm /etc/nginx/sites-enabled/default
```

#### Method B: CentOS/RHEL (using conf.d)

Create virtual host configurations directly in conf.d:

```bash
sudo nano /etc/nginx/conf.d/example1.com.conf
```

```nginx
# Virtual Host for example1.com
server {
    listen 80;
    listen [::]:80;
    
    server_name example1.com www.example1.com;
    root /var/www/example1.com/public_html;
    index index.html index.htm index.php;

    # Logging
    access_log /var/log/nginx/example1.com/access.log;
    error_log /var/log/nginx/example1.com/error.log;

    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }

    # PHP processing (if needed)
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Step 5: Configure PHP-FPM (Optional)

If you're hosting PHP applications, configure PHP-FPM pools for each website:

#### Create individual PHP-FPM pools

```bash
sudo nano /etc/php/8.0/fpm/pool.d/example1.com.conf
```

```ini
[example1.com]
user = www-data
group = www-data
listen = /var/run/php/php8.0-fpm-example1.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
php_admin_value[disable_functions] = exec,passthru,shell_exec,system
php_admin_flag[allow_url_fopen] = off
```

Update the virtual host to use the specific PHP-FPM pool:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php8.0-fpm-example1.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

### Step 6: Test Configuration and Restart Services

Test the Nginx configuration for syntax errors:

```bash
# Test configuration
sudo nginx -t

# Check PHP-FPM configuration (if applicable)
sudo php-fpm8.0 -t
```

If no errors are found, restart the services:

```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart PHP-FPM (if applicable)
sudo systemctl restart php8.0-fpm

# Check service status
sudo systemctl status nginx
sudo systemctl status php8.0-fpm
```

## Advanced Virtual Host Configurations

### SSL/HTTPS Configuration

Configure SSL certificates for each domain using Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificates
sudo certbot --nginx -d example1.com -d www.example1.com
sudo certbot --nginx -d example2.com -d www.example2.com
```

Example SSL-enabled virtual host:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example1.com www.example1.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name example1.com www.example1.com;
    root /var/www/example1.com/public_html;
    index index.html index.htm index.php;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/example1.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example1.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }

    # PHP processing
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm-example1.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Subdomain Configuration

Configure subdomains for better organization:

```nginx
# API subdomain
server {
    listen 80;
    listen [::]:80;
    server_name api.example1.com;
    root /var/www/example1.com/api;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm-example1.sock;
    }
}

# Blog subdomain
server {
    listen 80;
    listen [::]:80;
    server_name blog.example1.com;
    root /var/www/example1.com/blog;
    
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
}
```

### Load Balancing Between Multiple Servers

Configure upstream servers for load balancing:

```nginx
upstream backend_example1 {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name example1.com www.example1.com;
    
    location / {
        proxy_pass http://backend_example1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Best Practices

### 1. Implement Rate Limiting

Add rate limiting to prevent abuse:

```nginx
# In http block
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# In server block
location /login {
    limit_req zone=login burst=5 delay=3;
    # ... other configuration
}
```

### 2. Hide Server Information

```nginx
# In http block
server_tokens off;
more_set_headers "Server: ";
```

### 3. Implement Access Controls

```nginx
# Restrict admin areas by IP
location /admin {
    allow 192.168.1.0/24;
    allow 127.0.0.1;
    deny all;
    
    # ... other configuration
}

# Deny access to sensitive files
location ~* \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
    deny all;
}
```

### 4. Configure Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Performance Optimization

### 1. Enable Gzip Compression

```nginx
# In http block
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

### 2. Configure Browser Caching

```nginx
# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# Cache HTML files for shorter time
location ~* \.(html|htm)$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

### 3. Optimize Worker Processes

```nginx
# In main context
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}
```

## Monitoring and Maintenance

### 1. Log Management

Configure log rotation to prevent disk space issues:

```bash
sudo nano /etc/logrotate.d/nginx-vhosts
```

```
/var/log/nginx/*/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        systemctl reload nginx
    endscript
}
```

### 2. Monitoring Script

Create a monitoring script to check virtual host status:

```bash
#!/bin/bash
# Virtual Host Monitoring Script

DOMAINS=("example1.com" "example2.com" "example3.com")
LOG_FILE="/var/log/vhost-monitor.log"

echo "$(date): Starting virtual host monitoring" >> $LOG_FILE

for domain in "${DOMAINS[@]}"; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$domain)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "$(date): $domain - OK (HTTP $HTTP_STATUS)" >> $LOG_FILE
    else
        echo "$(date): $domain - ERROR (HTTP $HTTP_STATUS)" >> $LOG_FILE
        # Send alert email or notification here
    fi
done

echo "$(date): Virtual host monitoring completed" >> $LOG_FILE
```

### 3. Performance Monitoring

Monitor server performance and resource usage:

```bash
# Check Nginx processes
ps aux | grep nginx

# Monitor connections
netstat -tuln | grep :80
netstat -tuln | grep :443

# Check server load
uptime
top -p $(pgrep nginx)

# Monitor disk usage
df -h
du -sh /var/www/*/
du -sh /var/log/nginx/*/
```

## Troubleshooting Common Issues

### Issue 1: Virtual Host Not Loading

**Symptoms**: Website shows default Nginx page or 404 error

**Solutions**:

```bash
# Check configuration syntax
sudo nginx -t

# Verify virtual host is enabled
ls -la /etc/nginx/sites-enabled/  # Ubuntu/Debian
ls -la /etc/nginx/conf.d/         # CentOS/RHEL

# Check DNS resolution
nslookup example1.com
dig example1.com

# Verify document root exists and has content
ls -la /var/www/example1.com/public_html/
```

### Issue 2: PHP Not Working

**Solutions**:

```bash
# Check PHP-FPM status
sudo systemctl status php8.0-fpm

# Verify PHP-FPM socket exists
ls -la /var/run/php/

# Test PHP configuration
echo "<?php phpinfo(); ?>" | sudo tee /var/www/example1.com/public_html/info.php
```

### Issue 3: Permission Issues

**Solutions**:

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/

# Fix permissions
sudo find /var/www/ -type d -exec chmod 755 {} \;
sudo find /var/www/ -type f -exec chmod 644 {} \;

# Check SELinux context (CentOS/RHEL)
sudo setsebool -P httpd_can_network_connect 1
sudo restorecon -Rv /var/www/
```

## Best Practices Summary

### 1. Organization
- Use descriptive virtual host names
- Organize websites in separate directories
- Keep configuration files well-documented
- Use consistent naming conventions

### 2. Security
- Always use HTTPS in production
- Implement proper access controls
- Regular security updates
- Monitor access logs for suspicious activity

### 3. Performance
- Enable compression and caching
- Optimize images and static assets
- Use CDN for global content delivery
- Monitor resource usage regularly

### 4. Maintenance
- Regular backups of websites and configurations
- Monitor SSL certificate expiration
- Keep software updated
- Document all configurations and procedures

## Conclusion

Configuring Nginx virtual hosts enables you to efficiently host multiple websites on a single server, significantly reducing hosting costs while maintaining excellent performance and security. With proper configuration, monitoring, and maintenance, you can reliably serve multiple domains from one VPS.

### Key Benefits Achieved

- **Cost Efficiency**: Multiple websites on one server
- **Resource Optimization**: Efficient use of server resources
- **Centralized Management**: Easy administration of multiple sites
- **Scalability**: Simple addition of new websites
- **Professional Setup**: Production-ready configurations

### Performance Considerations

A properly configured server can typically handle:
- **5-10 small websites** on a 1GB RAM VPS
- **3-5 medium websites** with moderate traffic
- **1-3 high-traffic websites** depending on optimization

Regular monitoring, optimization, and maintenance ensure your virtual host setup continues to perform well as your websites grow and attract more visitors.

Whether you're hosting personal projects, client websites, or business applications, Nginx virtual hosts provide the flexibility and reliability needed for professional web hosting environments. 