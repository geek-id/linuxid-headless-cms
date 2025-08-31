---
title: "How to Install PHP 8 on Ubuntu, CentOS/RHEL, and AlmaLinux"
slug: "install-php-8-on-ubuntu-centos-rhel-almalinux"
excerpt: "Comprehensive guide to installing PHP 8 on multiple Linux distributions including Ubuntu, CentOS, RHEL, and AlmaLinux. Learn to configure PHP 8 with Apache and Nginx web servers for optimal performance."
published: true
publishedAt: "2021-07-20T00:31:00Z"
author: "Linux-ID Team"
template: "post"
featured: false
featuredImage: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&h=400&fit=crop&crop=center"
category: "System Administration"
tags: ["php", "ubuntu", "centos", "rhel", "almalinux", "apache", "nginx", "web-development"]
seo:
  title: "How to Install PHP 8 on Ubuntu, CentOS/RHEL, and AlmaLinux - Complete Guide"
  description: "Step-by-step guide to install PHP 8 on Ubuntu, CentOS, RHEL, and AlmaLinux. Configure PHP 8 with Apache and Nginx web servers for optimal web development performance."
  keywords: ["php 8 installation", "ubuntu php 8", "centos php 8", "rhel php 8", "almalinux php 8", "apache php", "nginx php", "web server configuration"]
  canonical: "https://linux-id.net/posts/install-php-8-on-ubuntu-centos-rhel-almalinux"
---

## What is PHP?

**PHP** (PHP: Hypertext Preprocessor) is a popular open-source server-side scripting language designed for web development. PHP 8, released in November 2020, introduced significant performance improvements and new features that make it an excellent choice for modern web applications.

Major content management systems and frameworks like **WordPress**, **Magento**, **Laravel**, **CodeIgniter**, and many others are built with PHP, making it essential for web developers and system administrators.

This comprehensive guide covers how to install PHP 8 on multiple Linux distributions including **Ubuntu**, **CentOS/RHEL**, and **AlmaLinux**, along with configuration for both **Apache** and **Nginx** web servers.

## PHP 8 Features and Benefits

### Key Features in PHP 8

- **Just-In-Time (JIT) Compilation** - Significant performance improvements
- **Named Arguments** - Better code readability and flexibility
- **Attributes** - Native annotation support
- **Union Types** - Enhanced type safety
- **Match Expression** - Modern alternative to switch statements
- **Nullsafe Operator** - Safer null handling
- **Constructor Property Promotion** - Cleaner class definitions

### Performance Benefits

- **Up to 3x faster execution** compared to PHP 7.4
- **Reduced memory usage** for better server efficiency
- **Improved error handling** with better debugging capabilities
- **Enhanced security features** for safer web applications

## Installing PHP 8 on Ubuntu

### Ubuntu 22.04 and 24.04

Ubuntu's default repositories may not include the latest PHP 8 versions. We'll use Ondřej Surý's PPA repository for the most up-to-date packages.

#### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Required Dependencies

```bash
sudo apt install -y software-properties-common apt-transport-https ca-certificates
```

#### Step 3: Add Ondřej Surý's PHP PPA

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

#### Step 4: Install PHP 8.4 (Latest Version)

**For Apache:**
```bash
sudo apt install -y php8.4 php8.4-cli php8.4-common libapache2-mod-php8.4
```

**For Nginx (using PHP-FPM):**
```bash
sudo apt install -y php8.4 php8.4-cli php8.4-fpm php8.4-common
```

#### Step 5: Install Essential PHP Extensions

```bash
sudo apt install -y php8.4-{curl,gd,mbstring,mysql,xml,zip,intl,bcmath,opcache,json,bz2}
```

### Ubuntu 20.04 LTS

For Ubuntu 20.04, follow the same steps but note that some packages may have different availability.

```bash
# Same steps as above
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4 php8.4-cli php8.4-fpm php8.4-common
```

## Installing PHP 8 on CentOS/RHEL

### Prerequisites for RHEL-based Systems

Before installing PHP 8 on CentOS, RHEL, or AlmaLinux, ensure your system is updated and has the necessary repositories.

#### Step 1: Update System

```bash
sudo dnf update -y
# or for older systems:
# sudo yum update -y
```

#### Step 2: Install EPEL and Remi Repositories

**For CentOS/RHEL 8 and 9:**
```bash
# Install EPEL repository
sudo dnf install -y epel-release

# Install Remi repository
sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %rhel).rpm
```

**For older CentOS 7:**
```bash
sudo yum install -y epel-release
sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm
```

#### Step 3: Install Yum/DNF Utilities

```bash
sudo dnf install -y dnf-utils
# or for CentOS 7:
# sudo yum install -y yum-utils
```

#### Step 4: Enable PHP 8.4 Module

**For CentOS/RHEL 8+:**
```bash
# Reset PHP module
sudo dnf module reset php -y

# Enable PHP 8.4 from Remi repository
sudo dnf module enable php:remi-8.4 -y
```

#### Step 5: Install PHP 8.4

```bash
sudo dnf install -y php php-cli php-fpm php-common
```

#### Step 6: Install PHP Extensions

```bash
sudo dnf install -y php-{curl,gd,mbstring,mysql,xml,zip,intl,bcmath,opcache,json,bz2}
```

## Installing PHP 8 on AlmaLinux

AlmaLinux follows the same process as CentOS/RHEL since it's a RHEL-compatible distribution.

### AlmaLinux 8 and 9

#### Step 1: Update System

```bash
sudo dnf update -y
```

#### Step 2: Add Required Repositories

```bash
# Install EPEL
sudo dnf install -y epel-release

# Install Remi repository for AlmaLinux
sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %rhel).rpm
```

#### Step 3: Configure PHP Module

```bash
sudo dnf module list php
sudo dnf module reset php -y
sudo dnf module enable php:remi-8.4 -y
```

#### Step 4: Install PHP 8.4

```bash
sudo dnf install -y php php-cli php-fpm php-common
sudo dnf install -y php-{curl,gd,mbstring,mysql,xml,zip,intl,bcmath,opcache}
```

## Configuring PHP 8 with Web Servers

### Apache Configuration

#### Enable PHP Module (Ubuntu)

```bash
# Enable PHP 8.4 module
sudo a2enmod php8.4

# If upgrading from older version, disable it first
sudo a2dismod php8.1  # or php7.4

# Restart Apache
sudo systemctl restart apache2
```

#### Enable PHP Module (CentOS/RHEL/AlmaLinux)

```bash
# Install Apache if not already installed
sudo dnf install -y httpd

# Start and enable Apache
sudo systemctl start httpd
sudo systemctl enable httpd

# PHP module is automatically configured
sudo systemctl restart httpd
```

### Nginx Configuration with PHP-FPM

#### Configure PHP-FPM

**Start and Enable PHP-FPM:**
```bash
# Ubuntu
sudo systemctl start php8.4-fpm
sudo systemctl enable php8.4-fpm

# CentOS/RHEL/AlmaLinux
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
```

#### Configure Nginx Virtual Host

Create or edit your Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/default  # Ubuntu
# or
sudo nano /etc/nginx/conf.d/default.conf      # CentOS/RHEL/AlmaLinux
```

Add the following PHP configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com;
    root /var/www/html;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;  # Ubuntu
        # include /etc/nginx/fastcgi_params;  # CentOS/RHEL/AlmaLinux
        
        # Ubuntu
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        
        # CentOS/RHEL/AlmaLinux
        # fastcgi_pass unix:/var/run/php-fpm/www.sock;
        
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

#### Test and Restart Nginx

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Verification and Testing

### Check PHP Version

```bash
php -v
```

Expected output:
```
PHP 8.4.x (cli) (built: ...) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.4.x, Copyright (c) Zend Technologies
    with Zend OPcache v8.4.x, Copyright (c), by Zend Technologies
```

### Check Loaded Extensions

```bash
php -m
```

### Create PHP Info Test File

```bash
sudo nano /var/www/html/info.php
```

Add the following content:

```php
<?php
phpinfo();
?>
```

### Set Proper Permissions

```bash
# Ubuntu
sudo chown www-data:www-data /var/www/html/info.php
sudo chmod 644 /var/www/html/info.php

# CentOS/RHEL/AlmaLinux
sudo chown apache:apache /var/www/html/info.php
sudo chmod 644 /var/www/html/info.php
```

### Access PHP Info Page

Open your web browser and navigate to:
- `http://your-server-ip/info.php`
- `http://your-domain.com/info.php`

You should see the PHP information page showing PHP 8.4 details.

**Security Note:** Remove the info.php file after testing:
```bash
sudo rm /var/www/html/info.php
```

## Managing Multiple PHP Versions

### Ubuntu - Switch Between PHP Versions

If you have multiple PHP versions installed:

```bash
# List available PHP versions
sudo update-alternatives --config php

# Set default PHP version
sudo update-alternatives --set php /usr/bin/php8.4

# For Apache, switch modules
sudo a2dismod php8.1
sudo a2enmod php8.4
sudo systemctl restart apache2
```

### Configure PHP-FPM for Different Versions

You can run multiple PHP-FPM versions simultaneously:

```bash
# Start multiple PHP-FPM services
sudo systemctl start php8.1-fpm
sudo systemctl start php8.4-fpm

# Configure different sockets in Nginx
# /run/php/php8.1-fpm.sock
# /run/php/php8.4-fpm.sock
```

## Optimizing PHP Configuration

### Essential php.ini Settings

Edit the PHP configuration file:

```bash
# Ubuntu
sudo nano /etc/php/8.4/apache2/php.ini    # For Apache
sudo nano /etc/php/8.4/fpm/php.ini       # For PHP-FPM

# CentOS/RHEL/AlmaLinux
sudo nano /etc/php.ini
```

Recommended settings for production:

```ini
; Basic Settings
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
post_max_size = 64M
upload_max_filesize = 64M

; Error Handling
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

; Security
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

; OPcache (Performance)
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
```

### Restart Services After Configuration Changes

```bash
# Ubuntu
sudo systemctl restart apache2     # For Apache
sudo systemctl restart php8.4-fpm  # For Nginx with PHP-FPM

# CentOS/RHEL/AlmaLinux
sudo systemctl restart httpd       # For Apache
sudo systemctl restart php-fpm     # For Nginx with PHP-FPM
sudo systemctl restart nginx       # Don't forget Nginx
```

## Troubleshooting Common Issues

### Issue 1: Package Not Found

**Problem:** PHP 8.4 packages not available.

**Solution:**
```bash
# Ubuntu - Ensure PPA is added correctly
sudo add-apt-repository ppa:ondrej/php
sudo apt update

# CentOS/RHEL/AlmaLinux - Check Remi repository
sudo dnf module list php
sudo dnf module enable php:remi-8.4
```

### Issue 2: PHP-FPM Socket Permission Errors

**Problem:** Nginx cannot connect to PHP-FPM socket.

**Solution:**
```bash
# Check socket permissions
ls -la /var/run/php/

# Fix permissions
sudo chown www-data:www-data /var/run/php/php8.4-fpm.sock  # Ubuntu
sudo chown nginx:nginx /var/run/php-fpm/www.sock          # CentOS/RHEL/AlmaLinux
```

### Issue 3: Apache Module Not Loading

**Problem:** PHP not processing after installation.

**Solution:**
```bash
# Ubuntu
sudo a2enmod php8.4
sudo systemctl restart apache2

# CentOS/RHEL/AlmaLinux
# Check if PHP module is loaded
sudo httpd -M | grep php
sudo systemctl restart httpd
```

## Security Considerations

### Disable Dangerous Functions

Add to php.ini:
```ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

### Set Proper File Permissions

```bash
# Web root permissions
sudo chown -R www-data:www-data /var/www/html    # Ubuntu
sudo chown -R apache:apache /var/www/html        # CentOS/RHEL/AlmaLinux

# Set directory permissions
sudo find /var/www/html -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/html -type f -exec chmod 644 {} \;
```

### Configure Firewall

```bash
# Ubuntu (UFW)
sudo ufw allow 'Apache Full'    # or 'Nginx Full'
sudo ufw enable

# CentOS/RHEL/AlmaLinux (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Conclusion

PHP 8 brings significant performance improvements and new features that benefit modern web development. By following this comprehensive guide, you can successfully install PHP 8 on Ubuntu, CentOS/RHEL, and AlmaLinux systems.

**Key Takeaways:**

- **PHP 8.4 is the latest stable version** with enhanced performance and features
- **Multiple installation methods** are available for different Linux distributions
- **Proper web server configuration** is essential for optimal performance
- **Security considerations** should always be implemented in production environments
- **Regular updates** ensure you have the latest security patches and improvements

Whether you're building new applications or upgrading existing ones, PHP 8 provides the performance and features needed for modern web development. Remember to test thoroughly in a development environment before upgrading production systems.

For complex server management needs, consider consulting with experienced system administrators or utilizing professional managed services that specialize in PHP and web server optimization.