---
title: "Deploy WordPress with NGINX Reverse Proxy and Docker"
slug: "deploy-wordpress-nginx-reverse-proxy-docker"
excerpt: "Learn how to deploy WordPress using NGINX reverse proxy and Docker containers for scalable, secure production environments. Complete guide with Docker Compose, SSL setup, performance optimization, and monitoring."
published: true
publishedAt: "2023-03-15T10:00:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=2070&q=80"
category: "DevOps"
tags: ["wordpress", "nginx", "docker", "reverse-proxy", "docker-compose", "ssl", "production", "containerization", "web-hosting"]
seo:
  title: "Deploy WordPress with NGINX Reverse Proxy Docker"
  description: "Complete guide to deploy WordPress with NGINX reverse proxy using Docker containers. Includes Docker Compose, SSL certificates, performance optimization, and production best practices."
  keywords: ["wordpress docker nginx", "nginx reverse proxy wordpress docker", "docker compose wordpress nginx", "wordpress production docker", "containerized wordpress deployment", "docker wordpress ssl"]
  canonical: "https://linux-id.net/posts/deploy-wordpress-nginx-reverse-proxy-docker"
---

Deploying **WordPress with NGINX reverse proxy using Docker** provides a modern, scalable, and maintainable solution for production web hosting. This containerized approach offers excellent isolation, easy scaling, and simplified deployment processes while leveraging NGINX's performance benefits for static content delivery and SSL termination.

This comprehensive guide covers the complete setup process, from basic Docker configuration to advanced production optimizations including SSL certificates, caching, monitoring, and security hardening.

## Architecture Overview

### Hybrid Container Architecture

```
Internet → NGINX (Host) → WordPress (Docker) → MySQL 8 (Host)
    ↓           ↓              ↓                    ↓
  Port 80/443  Host Service  Container           Host Service
               (systemd)     (docker)            (systemd)
```

### Key Components

| Component | Deployment | Service Management | Configuration Location |
|-----------|------------|-------------------|----------------------|
| **NGINX Proxy** | Host server | systemd service | `/etc/nginx/` |
| **WordPress** | Docker container | Docker Compose | `docker-compose.yml` |
| **MySQL 8** | Host server | systemd service | `/etc/mysql/` |
| **Redis** | Docker container (optional) | Docker Compose | `docker-compose.yml` |

### Benefits of This Hybrid Architecture

- **Performance**: Native NGINX and MySQL performance without container overhead
- **Flexibility**: Easy NGINX configuration management and MySQL tuning
- **Security**: Host-level firewall and security controls for database
- **Scalability**: WordPress containers can be scaled independently
- **Maintenance**: Separate update cycles for system services and applications
- **Resource Efficiency**: Optimal resource allocation between host and containers

## Prerequisites and Requirements

### System Requirements
- **Operating System**: Ubuntu 22.04 LTS, CentOS Stream 9, or RHEL 9
- **Memory**: Minimum 4GB RAM (8GB+ recommended for production)
- **CPU**: 2+ cores (4+ cores recommended for production)
- **Storage**: At least 50GB SSD storage
- **Network**: Static IP address and domain name

### Required Software
- **NGINX**: Latest stable version (host installation)
- **MySQL 8.0**: Latest stable version (host installation)
- **Docker Engine**: Version 20.10+ (for WordPress containers)
- **Docker Compose**: Version 2.0+
- **PHP-FPM**: Not needed (handled by WordPress container)

### Pre-installation Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
sudo dnf update -y                      # CentOS/RHEL

# Install required packages
sudo apt install curl wget git ufw -y  # Ubuntu/Debian
sudo dnf install curl wget git firewalld -y  # CentOS/RHEL

# Check system resources
free -h
df -h
nproc
```

## NGINX Installation and Configuration (Host)

### Install NGINX on Host System

#### Ubuntu/Debian Installation
```bash
# Install NGINX
sudo apt update
sudo apt install nginx -y

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

# Check NGINX status
sudo systemctl status nginx
```

#### CentOS/RHEL Installation
```bash
# Install NGINX
sudo dnf install nginx -y

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

# Check NGINX status
sudo systemctl status nginx
```

### NGINX Configuration for WordPress Docker

#### Main NGINX Configuration
```bash
sudo nano /etc/nginx/nginx.conf
```

**nginx.conf:**
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
    
    # Buffer settings
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
    
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
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=wp_login:10m rate=1r/s;
    limit_req_zone $binary_remote_addr zone=wp_admin:10m rate=5r/s;
    limit_req_zone $binary_remote_addr zone=wp_api:10m rate=10r/s;
    
    # Cache configuration
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=wordpress_cache:10m max_size=1g inactive=60m use_temp_path=off;
    
    # Include virtual host configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

#### WordPress Virtual Host Configuration
```bash
sudo nano /etc/nginx/sites-available/wordpress
```

**wordpress virtual host:**
```nginx
# Upstream to WordPress Docker containers
upstream wordpress_backend {
    server wordpress:9000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name example.com www.example.com;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # Document root (shared with WordPress container)
    root /var/www/wordpress;
    index index.php index.html index.htm;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/wordpress.crt;
    ssl_certificate_key /etc/ssl/private/wordpress.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # WordPress security
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
    
    # Deny access to sensitive files
    location ~* \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
        deny all;
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # WordPress admin rate limiting
    location ~ ^/(wp-admin|wp-login\.php) {
        limit_req zone=wp_admin burst=5 nodelay;
        
        try_files $uri $uri/ /index.php?$args;
        
        location ~ \.php$ {
            fastcgi_pass wordpress_backend;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            
            # Security parameters
            fastcgi_param HTTP_PROXY "";
            fastcgi_param HTTPS on;
            fastcgi_param SERVER_PORT 443;
            
            # Timeouts
            fastcgi_connect_timeout 60s;
            fastcgi_send_timeout 60s;
            fastcgi_read_timeout 60s;
        }
    }
    
    # WordPress API rate limiting
    location ~ ^/wp-json/ {
        limit_req zone=wp_api burst=20 nodelay;
        
        try_files $uri $uri/ /index.php?$args;
        
        location ~ \.php$ {
            fastcgi_pass wordpress_backend;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            
            fastcgi_param HTTP_PROXY "";
            fastcgi_param HTTPS on;
            fastcgi_param SERVER_PORT 443;
        }
    }
    
    # Static files with long expiry
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Try to serve static files directly
        try_files $uri $uri/ =404;
    }
    
    # WordPress uploads
    location ~* ^/wp-content/uploads/.*\.(php|php5|phtml|pl|py|jsp|asp|sh|cgi)$ {
        deny all;
    }
    
    # Main location block
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    # PHP processing
    location ~ \.php$ {
        try_files $uri =404;
        
        fastcgi_pass wordpress_backend;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Security and SSL parameters
        fastcgi_param HTTP_PROXY "";
        fastcgi_param HTTPS on;
        fastcgi_param SERVER_PORT 443;
        
        # Buffer settings
        fastcgi_buffering on;
        fastcgi_buffer_size 4k;
        fastcgi_buffers 8 4k;
        fastcgi_busy_buffers_size 8k;
        
        # Timeouts
        fastcgi_connect_timeout 60s;
        fastcgi_send_timeout 60s;
        fastcgi_read_timeout 60s;
    }
    
    # WordPress sitemap
    location ~ ^/sitemap(_index)?\.xml {
        try_files $uri $uri/ /index.php?$args;
    }
    
    # WordPress feeds
    location ~* ^/feed/(.*)?$ {
        try_files $uri $uri/ /index.php?$args;
    }
}
```

#### Enable WordPress Site
```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test NGINX configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

## MySQL 8 Installation and Configuration (Host)

### Install MySQL 8 on Host System

#### Ubuntu/Debian Installation
```bash
# Install MySQL 8.0
sudo apt update
sudo apt install mysql-server -y

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Check MySQL status
sudo systemctl status mysql
```

#### CentOS/RHEL Installation
```bash
# Install MySQL 8.0
sudo dnf install mysql-server -y

# Start and enable MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure MySQL installation
sudo mysql_secure_installation

# Check MySQL status
sudo systemctl status mysqld
```

### MySQL Configuration for WordPress

#### Create WordPress Database and User
```bash
# Connect to MySQL as root
sudo mysql -u root -p
```

```sql
-- Create WordPress database
CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create WordPress user
CREATE USER 'wordpress_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
CREATE USER 'wordpress_user'@'127.0.0.1' IDENTIFIED BY 'your_strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress_user'@'localhost';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress_user'@'127.0.0.1';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

#### MySQL Performance Configuration
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

**MySQL configuration:**
```ini
[mysqld]
# Basic settings
bind-address = 127.0.0.1
port = 3306
default-authentication-plugin = mysql_native_password
skip-name-resolve
explicit_defaults_for_timestamp = 1

# Performance settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Connection settings
max_connections = 200
max_connect_errors = 1000000
wait_timeout = 28800
interactive_timeout = 28800

# Logging
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Binary logging
log-bin = mysql-bin
binlog_format = ROW
expire_logs_days = 7

# Security
local_infile = 0

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[mysql]
default-character-set = utf8mb4

[client]
default-character-set = utf8mb4
```

```bash
# Restart MySQL to apply changes
sudo systemctl restart mysql
```

## Docker Installation and WordPress Setup

### Install Docker Engine

#### Ubuntu/Debian Installation
```bash
# Remove old Docker versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

### Project Structure Setup

```bash
# Create project directory
mkdir -p ~/wordpress-docker
cd ~/wordpress-docker

# Create directory structure
mkdir -p {wordpress,logs,backups,scripts}

# Create shared WordPress directory
sudo mkdir -p /var/www/wordpress
sudo chown $USER:$USER /var/www/wordpress

# Create necessary files
touch docker-compose.yml .env
```

### Docker Compose Configuration (WordPress Only)

```bash
nano docker-compose.yml
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # WordPress Application
  wordpress:
    image: wordpress:php8.2-fpm
    container_name: wordpress_app
    restart: unless-stopped
    environment:
      WORDPRESS_DB_HOST: host.docker.internal:3306
      WORDPRESS_DB_NAME: ${MYSQL_DATABASE}
      WORDPRESS_DB_USER: ${MYSQL_USER}
      WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD}
      WORDPRESS_TABLE_PREFIX: ${WORDPRESS_TABLE_PREFIX}
      WORDPRESS_DEBUG: ${WORDPRESS_DEBUG}
    volumes:
      - /var/www/wordpress:/var/www/html
      - ./wordpress/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini:ro
      - ./logs/wordpress:/var/log/wordpress
    ports:
      - "127.0.0.1:9000:9000"
    networks:
      - wordpress_network
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9000/ping || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: wordpress_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"
    networks:
      - wordpress_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  redis_data:
    driver: local

networks:
  wordpress_network:
    driver: bridge
```

### Environment Configuration
```bash
nano .env
```

**.env file:**
```bash
# MySQL Configuration (Host MySQL)
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress_user
MYSQL_PASSWORD=your_strong_password_here

# WordPress Configuration
WORDPRESS_TABLE_PREFIX=wp_
WORDPRESS_DEBUG=false

# Redis Configuration
REDIS_PASSWORD=your_redis_password_here

# Domain Configuration
DOMAIN_NAME=example.com
WWW_DOMAIN=www.example.com

# Backup Configuration
BACKUP_RETENTION_DAYS=30
```

## PHP Configuration for WordPress Container

### PHP Configuration
```bash
nano wordpress/uploads.ini
```

**uploads.ini:**
```ini
; PHP Configuration for WordPress
file_uploads = On
memory_limit = 256M
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
max_input_vars = 3000
max_input_time = 300

; Session configuration
session.gc_maxlifetime = 1440
session.save_path = "/tmp"

; Error reporting (disable in production)
display_errors = Off
log_errors = On
error_log = /var/log/wordpress/php_errors.log

; Security settings
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

; OPcache settings
opcache.enable = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 4000
opcache.revalidate_freq = 2
opcache.fast_shutdown = 1
```

## SSL Certificate Setup

### Option 1: Let's Encrypt with Certbot

#### Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo dnf install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
# Obtain certificate and configure NGINX automatically
sudo certbot --nginx -d example.com -d www.example.com

# Or obtain certificate only (manual NGINX configuration)
sudo certbot certonly --nginx \
    -d example.com \
    -d www.example.com \
    --email admin@example.com \
    --agree-tos \
    --no-eff-email
```

#### Automated Certificate Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet && systemctl reload nginx
```

### Option 2: Self-Signed Certificate (Development)

```bash
# Create SSL directory
sudo mkdir -p /etc/ssl/private

# Create self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/wordpress.key \
    -out /etc/ssl/certs/wordpress.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=example.com"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/wordpress.key
sudo chmod 644 /etc/ssl/certs/wordpress.crt
```

## Deployment and Management

### Initial Deployment

#### Start Host Services
```bash
# Start and verify NGINX
sudo systemctl start nginx
sudo systemctl status nginx

# Start and verify MySQL
sudo systemctl start mysql
sudo systemctl status mysql

# Test NGINX configuration
sudo nginx -t
```

#### Start WordPress Containers
```bash
# Navigate to project directory
cd ~/wordpress-docker

# Start WordPress containers
docker compose up -d

# Check container status
docker compose ps

# View logs
docker compose logs -f wordpress
```

#### Verify Connectivity
```bash
# Test MySQL connection from host
mysql -u wordpress_user -p -h 127.0.0.1 wordpress

# Test WordPress container connectivity
docker compose exec wordpress wp --info --allow-root

# Check NGINX upstream connectivity
curl -I http://127.0.0.1:9000
```

### WordPress Installation
```bash
# Access WordPress setup via web browser
# Navigate to https://your-domain.com

# Or use WP-CLI for automated setup
docker compose exec wordpress wp core install \
    --url="https://example.com" \
    --title="Your WordPress Site" \
    --admin_user="admin" \
    --admin_password="secure_password" \
    --admin_email="admin@example.com" \
    --allow-root
```

### Service Management Commands

#### NGINX Management
```bash
# Reload NGINX configuration
sudo systemctl reload nginx

# Restart NGINX
sudo systemctl restart nginx

# Check NGINX status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View NGINX logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### MySQL Management
```bash
# Restart MySQL
sudo systemctl restart mysql

# Check MySQL status
sudo systemctl status mysql

# Connect to MySQL
sudo mysql -u root -p

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
sudo tail -f /var/log/mysql/slow.log
```

#### WordPress Container Management
```bash
# Restart WordPress container
docker compose restart wordpress

# Scale WordPress containers
docker compose up -d --scale wordpress=2

# Execute commands in WordPress container
docker compose exec wordpress bash
docker compose exec wordpress wp --info --allow-root

# View WordPress logs
docker compose logs wordpress
tail -f logs/wordpress/php_errors.log
```

## Backup and Recovery

### Automated Backup Script for Hybrid Setup
```bash
mkdir -p scripts
nano scripts/backup.sh
```

**backup.sh:**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/$USER/wordpress-docker/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
MYSQL_USER="wordpress_user"
MYSQL_PASSWORD="your_strong_password_here"
MYSQL_DATABASE="wordpress"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "Starting hybrid backup process..."

# Backup WordPress files (from shared volume)
echo "Backing up WordPress files..."
tar -czf $BACKUP_DIR/wordpress_files_$DATE.tar.gz -C /var/www/wordpress .

# Backup MySQL database (host MySQL)
echo "Backing up MySQL database..."
mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > $BACKUP_DIR/mysql_backup_$DATE.sql
gzip $BACKUP_DIR/mysql_backup_$DATE.sql

# Backup NGINX configuration
echo "Backing up NGINX configuration..."
tar -czf $BACKUP_DIR/nginx_config_$DATE.tar.gz -C /etc/nginx .

# Backup Docker configuration
echo "Backing up Docker configuration..."
tar -czf $BACKUP_DIR/docker_config_$DATE.tar.gz -C /home/$USER/wordpress-docker --exclude=backups --exclude=logs .

# Remove old backups
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "wordpress_files_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "mysql_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "nginx_config_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "docker_config_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

```bash
# Make script executable
chmod +x scripts/backup.sh

# Test backup
./scripts/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/$USER/wordpress-docker/scripts/backup.sh
```

### Recovery Process
```bash
# Stop services
docker compose down
sudo systemctl stop nginx

# Restore WordPress files
tar -xzf backups/wordpress_files_YYYYMMDD_HHMMSS.tar.gz -C /var/www/wordpress/

# Restore MySQL database
gunzip backups/mysql_backup_YYYYMMDD_HHMMSS.sql.gz
mysql -u wordpress_user -p wordpress < backups/mysql_backup_YYYYMMDD_HHMMSS.sql

# Restore NGINX configuration (if needed)
sudo tar -xzf backups/nginx_config_YYYYMMDD_HHMMSS.tar.gz -C /etc/nginx/

# Restore Docker configuration
tar -xzf backups/docker_config_YYYYMMDD_HHMMSS.tar.gz -C /home/$USER/wordpress-docker/

# Restart services
sudo systemctl start nginx
docker compose up -d
```

## Performance Optimization

### Redis Cache Integration

#### Install Redis Plugin in WordPress
```bash
# Download and activate Redis Object Cache plugin
docker compose exec wordpress wp plugin install redis-cache --activate --allow-root

# Configure Redis connection to container
docker compose exec wordpress wp config set WP_REDIS_HOST 127.0.0.1 --allow-root
docker compose exec wordpress wp config set WP_REDIS_PORT 6379 --allow-root
docker compose exec wordpress wp config set WP_REDIS_PASSWORD $REDIS_PASSWORD --allow-root
docker compose exec wordpress wp config set WP_REDIS_DATABASE 0 --allow-root

# Enable Redis cache
docker compose exec wordpress wp redis enable --allow-root
```

### NGINX Caching Configuration

#### Add FastCGI Caching
```bash
sudo nano /etc/nginx/sites-available/wordpress
```

Add to the server block:
```nginx
# FastCGI cache configuration
fastcgi_cache_path /var/cache/nginx/fastcgi levels=1:2 keys_zone=wordpress:100m inactive=60m;
fastcgi_cache_key "$scheme$request_method$host$request_uri";

# Cache bypass conditions
set $skip_cache 0;

# Skip cache for admin pages
if ($request_uri ~* "/wp-admin/|/xmlrpc.php|wp-.*.php|/feed/|index.php|sitemap(_index)?.xml") {
    set $skip_cache 1;
}

# Skip cache for logged in users
if ($http_cookie ~* "comment_author|wordpress_[a-f0-9]+|wp-postpass|wordpress_no_cache|wordpress_logged_in") {
    set $skip_cache 1;
}

# Add to PHP location block
location ~ \.php$ {
    # ... existing configuration ...
    
    # FastCGI cache settings
    fastcgi_cache wordpress;
    fastcgi_cache_valid 200 302 60m;
    fastcgi_cache_valid 404 1m;
    fastcgi_cache_bypass $skip_cache;
    fastcgi_no_cache $skip_cache;
    
    add_header X-Cache-Status $upstream_cache_status;
}
```

```bash
# Create cache directory
sudo mkdir -p /var/cache/nginx/fastcgi
sudo chown nginx:nginx /var/cache/nginx/fastcgi

# Reload NGINX
sudo systemctl reload nginx
```

### MySQL Performance Tuning

#### Optimize MySQL for WordPress
```sql
-- Connect to MySQL
mysql -u root -p

-- Optimize WordPress database
USE wordpress;

-- Optimize tables
OPTIMIZE TABLE wp_posts;
OPTIMIZE TABLE wp_postmeta;
OPTIMIZE TABLE wp_options;
OPTIMIZE TABLE wp_comments;
OPTIMIZE TABLE wp_commentmeta;
OPTIMIZE TABLE wp_users;
OPTIMIZE TABLE wp_usermeta;

-- Check table status
SHOW TABLE STATUS;

-- Check MySQL performance
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';
SHOW GLOBAL STATUS LIKE 'Slow_queries';
```

## Monitoring and Logging

### System Monitoring Script
```bash
nano scripts/monitor.sh
```

**monitor.sh:**
```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "WordPress Hybrid Deployment Health Check"
echo "========================================"

# Check NGINX status
echo -e "\n${YELLOW}NGINX Status:${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "NGINX: ${GREEN}running${NC}"
else
    echo -e "NGINX: ${RED}stopped${NC}"
fi

# Check MySQL status
echo -e "\n${YELLOW}MySQL Status:${NC}"
if systemctl is-active --quiet mysql; then
    echo -e "MySQL: ${GREEN}running${NC}"
else
    echo -e "MySQL: ${RED}stopped${NC}"
fi

# Check WordPress container status
echo -e "\n${YELLOW}WordPress Container Status:${NC}"
if docker compose ps | grep -q "wordpress_app.*Up"; then
    echo -e "WordPress: ${GREEN}running${NC}"
else
    echo -e "WordPress: ${RED}stopped${NC}"
fi

# Check Redis container status
echo -e "\n${YELLOW}Redis Container Status:${NC}"
if docker compose ps | grep -q "wordpress_redis.*Up"; then
    echo -e "Redis: ${GREEN}running${NC}"
else
    echo -e "Redis: ${RED}stopped${NC}"
fi

# Check website accessibility
echo -e "\n${YELLOW}Website Accessibility:${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://example.com | grep -q "200"; then
    echo -e "Website: ${GREEN}accessible${NC}"
else
    echo -e "Website: ${RED}not accessible${NC}"
fi

# Check disk usage
echo -e "\n${YELLOW}Disk Usage:${NC}"
df -h | grep -E "/$|/var"

# Check memory usage
echo -e "\n${YELLOW}Memory Usage:${NC}"
free -h

# Check MySQL connections
echo -e "\n${YELLOW}MySQL Connections:${NC}"
mysql -u wordpress_user -p$MYSQL_PASSWORD -e "SHOW STATUS LIKE 'Threads_connected';" 2>/dev/null || echo "Cannot connect to MySQL"

# Check container resource usage
echo -e "\n${YELLOW}Container Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" 2>/dev/null || echo "No containers running"
```

```bash
chmod +x scripts/monitor.sh
./scripts/monitor.sh
```

## Security Hardening

### Host-Level Security

#### Firewall Configuration (UFW - Ubuntu/Debian)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL only from localhost (if needed for external tools)
# sudo ufw allow from 127.0.0.1 to any port 3306

# Deny all other traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Check status
sudo ufw status verbose
```

#### MySQL Security
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Remove remote root access
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Remove test database
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

-- Flush privileges
FLUSH PRIVILEGES;
```

### WordPress Security Configuration

#### Security Headers in wp-config.php
```bash
# Edit WordPress configuration
docker compose exec wordpress wp config set DISALLOW_FILE_EDIT true --allow-root
docker compose exec wordpress wp config set DISALLOW_FILE_MODS true --allow-root
docker compose exec wordpress wp config set FORCE_SSL_ADMIN true --allow-root
docker compose exec wordpress wp config set WP_AUTO_UPDATE_CORE true --allow-root

# Install security plugins
docker compose exec wordpress wp plugin install wordfence --activate --allow-root
docker compose exec wordpress wp plugin install limit-login-attempts-reloaded --activate --allow-root
```

## Troubleshooting Common Issues

### Issue 1: WordPress Cannot Connect to MySQL

**Symptoms:**
```
Error establishing a database connection
WordPress container logs show connection refused
```

**Diagnosis:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Test MySQL connection from host
mysql -u wordpress_user -p -h 127.0.0.1 wordpress

# Check if MySQL is listening on correct port
sudo netstat -tlnp | grep :3306

# Test from WordPress container
docker compose exec wordpress mysql -u wordpress_user -p -h host.docker.internal wordpress
```

**Solutions:**
```bash
# Ensure MySQL is configured to accept connections
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Check: bind-address = 127.0.0.1

# Restart MySQL
sudo systemctl restart mysql

# Verify user permissions
mysql -u root -p
SHOW GRANTS FOR 'wordpress_user'@'127.0.0.1';
```

### Issue 2: NGINX Cannot Reach WordPress Container

**Symptoms:**
```
502 Bad Gateway errors
NGINX logs show "connect() failed"
```

**Diagnosis:**
```bash
# Check if WordPress container is running
docker compose ps

# Check if port 9000 is accessible
curl -I http://127.0.0.1:9000

# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Test upstream connectivity
sudo nginx -t
```

**Solutions:**
```bash
# Restart WordPress container
docker compose restart wordpress

# Check port binding
docker compose ps
# Should show 127.0.0.1:9000->9000/tcp

# Verify NGINX upstream configuration
sudo nano /etc/nginx/sites-available/wordpress
# Check: server 127.0.0.1:9000;

# Reload NGINX
sudo systemctl reload nginx
```

### Issue 3: File Permission Issues

**Symptoms:**
```
WordPress cannot write files
Upload errors
Plugin/theme installation fails
```

**Solutions:**
```bash
# Fix WordPress directory permissions
sudo chown -R www-data:www-data /var/www/wordpress
sudo find /var/www/wordpress -type d -exec chmod 755 {} \;
sudo find /var/www/wordpress -type f -exec chmod 644 {} \;

# Fix wp-config.php permissions
sudo chmod 600 /var/www/wordpress/wp-config.php

# Restart WordPress container
docker compose restart wordpress
```

### Issue 4: SSL Certificate Problems

**Symptoms:**
```
SSL certificate errors
Mixed content warnings
Certificate not found errors
```

**Solutions:**
```bash
# Check certificate files
sudo ls -la /etc/ssl/certs/wordpress.crt
sudo ls -la /etc/ssl/private/wordpress.key

# Test certificate validity
sudo openssl x509 -in /etc/ssl/certs/wordpress.crt -text -noout

# Check NGINX SSL configuration
sudo nginx -t

# For Let's Encrypt certificates
sudo certbot certificates
sudo certbot renew --dry-run
```

## Scaling and Load Balancing

### Horizontal Scaling WordPress Containers

#### Multiple WordPress Containers
```yaml
# Update docker-compose.yml
version: '3.8'

services:
  wordpress:
    image: wordpress:php8.2-fpm
    deploy:
      replicas: 3
    # ... rest of configuration
```

#### NGINX Load Balancer Configuration
```nginx
# Update /etc/nginx/sites-available/wordpress
upstream wordpress_backend {
    least_conn;
    server 127.0.0.1:9000 weight=3;
    server 127.0.0.1:9001 weight=2;
    server 127.0.0.1:9002 weight=1;
    keepalive 32;
}
```

#### Deploy Multiple Containers
```bash
# Scale WordPress containers
docker compose up -d --scale wordpress=3

# Update port mappings in docker-compose.yml
ports:
  - "127.0.0.1:9000-9002:9000"
```

### Database Scaling Options

#### MySQL Read Replicas
```bash
# Configure MySQL master-slave replication
# Master configuration in /etc/mysql/mysql.conf.d/mysqld.cnf
server-id = 1
log-bin = mysql-bin
binlog-do-db = wordpress

# Create replication user
mysql -u root -p
CREATE USER 'replicator'@'%' IDENTIFIED BY 'replica_password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
```

## Conclusion

This **hybrid deployment approach** combining **NGINX and MySQL as host services with WordPress in Docker containers** provides an optimal balance of performance, flexibility, and maintainability for production environments.

### Key Benefits Achieved

- **Performance**: Native NGINX and MySQL performance without containerization overhead
- **Flexibility**: Easy configuration management for web server and database
- **Scalability**: WordPress containers can be scaled independently
- **Security**: Host-level security controls for critical services
- **Maintenance**: Separate update cycles for system services and applications
- **Resource Efficiency**: Optimal resource allocation between host and containers

### Production Readiness Checklist

- ✅ NGINX configured as reverse proxy on host
- ✅ MySQL 8 installed and secured on host
- ✅ WordPress running in optimized Docker containers
- ✅ SSL/TLS certificates configured
- ✅ Database backups automated
- ✅ Security headers and firewall configured
- ✅ Performance optimization enabled
- ✅ Monitoring and logging setup
- ✅ Container health checks active

### Best Practices Summary

1. **Service Separation**: Keep critical services (NGINX, MySQL) on host for maximum control
2. **Container Optimization**: Use WordPress containers for application isolation and scaling
3. **Security Layering**: Implement security at both host and container levels
4. **Backup Strategy**: Backup both host configurations and container data
5. **Monitoring**: Monitor both host services and container metrics
6. **Performance Tuning**: Optimize each component independently

### Scaling Considerations

- **Horizontal Scaling**: Add more WordPress containers behind NGINX load balancer
- **Database Scaling**: Implement MySQL read replicas for high-traffic sites
- **Caching Strategy**: Use Redis containers with host-based NGINX caching
- **Resource Optimization**: Monitor and adjust resource allocation between host and containers

This hybrid approach provides the best of both worlds: the reliability and performance of native services with the flexibility and scalability of containerized applications, making it ideal for production WordPress deployments that require both stability and growth potential. 
For advanced configurations and enterprise deployments, consider implementing Kubernetes orchestration, advanced monitoring solutions like Prometheus and Grafana, and automated CI/CD pipelines for continuous deployment. 
For advanced configurations and enterprise deployments, consider implementing Kubernetes orchestration, advanced monitoring solutions like Prometheus and Grafana, and automated CI/CD pipelines for continuous deployment. 