---
title: "How to Install PHP 7.4 on Ubuntu and CentOS/RHEL"
slug: "install-php-7-4-ubuntu-centos-rhel"
excerpt: "Comprehensive guide to installing PHP 7.4 on Ubuntu 20.04/22.04 and CentOS/RHEL 7/8 systems. Learn step-by-step installation procedures, configuration, and troubleshooting for both distributions with practical examples."
published: true
publishedAt: "2021-09-12T00:30:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "Web Server"
tags: ["php", "ubuntu", "centos", "rhel", "web-server", "tutorial", "installation"]
seo:
  title: "How to Install PHP 7.4 on Ubuntu and CentOS/RHEL - Complete Guide"
  description: "Learn how to install PHP 7.4 on Ubuntu 20.04/22.04 and CentOS/RHEL 7/8 systems. Complete guide covering installation procedures, configuration, and troubleshooting for both distributions."
  keywords: ["install php", "php 7.4", "ubuntu", "centos", "rhel", "web server", "apache", "nginx", "php installation"]
  canonical: "https://linux-id.net/posts/install-php-7-4-ubuntu-centos-rhel"
---

**PHP (PHP: Hypertext Preprocessor)** is a widely-used, open-source server-side scripting language designed specifically for web development. PHP powers millions of websites and web applications worldwide, including popular content management systems like WordPress, Drupal, and Joomla.

This comprehensive guide provides step-by-step instructions for installing **PHP 7.4** on both **Ubuntu** and **CentOS/RHEL** systems. Whether you're setting up a development environment or deploying a production server, this tutorial covers everything you need to know.

## What is PHP?

**PHP (PHP: Hypertext Preprocessor)** is a popular server-side programming language primarily used for creating dynamic and interactive websites. Originally created by Rasmus Lerdorf in 1994, PHP has evolved into one of the most widely-adopted web programming languages.

### Key Features of PHP

- **Server-side scripting**: Executes on the web server before sending content to the browser
- **Cross-platform compatibility**: Runs on various operating systems including Linux, Windows, and macOS
- **Database integration**: Excellent support for MySQL, PostgreSQL, MongoDB, and other databases
- **Large community**: Extensive documentation, frameworks, and third-party libraries
- **Easy to learn**: Simple syntax makes it accessible for beginners

### PHP 7.4 Features and Benefits

PHP 7.4, released in November 2019, introduced several performance improvements and new features:

- **Improved performance**: Up to 50% faster than PHP 5.6
- **Typed properties**: Better type safety for class properties
- **Arrow functions**: Simplified anonymous function syntax
- **Null coalescing assignment operator**: Streamlined null value handling
- **Foreign Function Interface (FFI)**: Call C functions directly from PHP

## Prerequisites

Before installing PHP 7.4, ensure your system meets the following requirements:

### System Requirements
- **Ubuntu**: 18.04 LTS, 20.04 LTS, or 22.04 LTS
- **CentOS/RHEL**: Version 7 or 8
- **Root or sudo access**: Administrative privileges required
- **Internet connection**: For downloading packages

### Recommended Specifications
- **RAM**: Minimum 1GB (2GB recommended)
- **Storage**: At least 2GB free space
- **CPU**: Any modern x86_64 processor

## Installing PHP 7.4 on Ubuntu

### Method 1: Installing from Default Repository

Ubuntu 20.04 includes PHP 7.4 in its default repositories, making installation straightforward:

#### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

This command updates the package list and upgrades existing packages to their latest versions.

#### Step 2: Install PHP 7.4

```bash
sudo apt install php7.4 -y
```

#### Step 3: Install Common PHP Extensions

```bash
sudo apt install php7.4-{cli,fpm,mysql,zip,gd,mbstring,curl,xml,bcmath,json} -y
```

This installs essential PHP extensions commonly required for web applications.

### Method 2: Using Ondřej Surý PPA (For Older Ubuntu Versions)

If you're using Ubuntu 18.04 or need specific PHP versions, use the Ondřej Surý PPA:

#### Step 1: Install Prerequisites

```bash
sudo apt install software-properties-common -y
```

#### Step 2: Add PHP PPA Repository

```bash
sudo add-apt-repository ppa:ondrej/php -y
```

#### Step 3: Update Package Lists

```bash
sudo apt update
```

#### Step 4: Install PHP 7.4

```bash
sudo apt install php7.4 php7.4-{cli,fpm,mysql,zip,gd,mbstring,curl,xml,bcmath,json} -y
```

### Configuring PHP with Web Servers on Ubuntu

#### For Apache Web Server

```bash
# Install Apache and PHP module
sudo apt install apache2 libapache2-mod-php7.4 -y

# Enable PHP module
sudo a2enmod php7.4

# Restart Apache
sudo systemctl restart apache2
```

#### For Nginx Web Server

```bash
# Install Nginx and PHP-FPM
sudo apt install nginx php7.4-fpm -y

# Start and enable services
sudo systemctl start nginx php7.4-fpm
sudo systemctl enable nginx php7.4-fpm
```

## Installing PHP 7.4 on CentOS/RHEL

### Step 1: Enable Required Repositories

#### For CentOS/RHEL 8

```bash
# Install EPEL repository
sudo dnf install epel-release -y

# Install Remi repository
sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm -y
```

#### For CentOS/RHEL 7

```bash
# Install EPEL repository
sudo yum install epel-release -y

# Install Remi repository
sudo yum install https://rpms.remirepo.net/enterprise/remi-release-7.rpm -y
```

### Step 2: Configure PHP Repository

#### For CentOS/RHEL 8

```bash
# Reset PHP module
sudo dnf module reset php -y

# Enable PHP 7.4 module
sudo dnf module enable php:remi-7.4 -y
```

#### For CentOS/RHEL 7

```bash
# Install yum-utils
sudo yum install yum-utils -y

# Enable PHP 7.4 repository
sudo yum-config-manager --enable remi-php74
```

### Step 3: Install PHP 7.4

#### For CentOS/RHEL 8

```bash
sudo dnf install php php-{cli,fpm,mysql,zip,gd,mbstring,curl,xml,bcmath,json} -y
```

#### For CentOS/RHEL 7

```bash
sudo yum install php php-{cli,fpm,mysql,zip,gd,mbstring,curl,xml,bcmath,json} -y
```

### Configuring PHP with Web Servers on CentOS/RHEL

#### For Apache Web Server

```bash
# Install Apache
sudo yum install httpd -y  # CentOS/RHEL 7
# OR
sudo dnf install httpd -y  # CentOS/RHEL 8

# Start and enable services
sudo systemctl start httpd
sudo systemctl enable httpd
```

#### For Nginx Web Server

```bash
# Install Nginx
sudo yum install nginx -y  # CentOS/RHEL 7
# OR
sudo dnf install nginx -y  # CentOS/RHEL 8

# Start and enable services
sudo systemctl start nginx php-fpm
sudo systemctl enable nginx php-fpm
```

## PHP Configuration

### Basic PHP Configuration

Edit the main PHP configuration file:

```bash
sudo nano /etc/php/7.4/apache2/php.ini  # Ubuntu with Apache
sudo nano /etc/php/7.4/fpm/php.ini      # Ubuntu with Nginx
sudo nano /etc/php.ini                   # CentOS/RHEL
```

### Recommended Configuration Settings

```ini
# Memory limit (adjust based on your needs)
memory_limit = 256M

# Maximum execution time
max_execution_time = 300

# File upload settings
upload_max_filesize = 50M
post_max_size = 50M

# Maximum number of files that can be uploaded
max_file_uploads = 20

# Timezone setting (adjust to your timezone)
date.timezone = "America/New_York"

# Error reporting (disable in production)
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log
```

## Verification and Testing

### Verify PHP Installation

Check the installed PHP version:

```bash
php -v
```

Expected output:
```
PHP 7.4.3 (cli) (built: Oct  6 2020 15:47:56) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies
    with Zend OPcache v7.4.3, Copyright (c), by Zend Technologies
```

### Check Installed Extensions

```bash
php -m
```

### Create a PHP Test File

Create a simple PHP test file to verify web server integration:

```bash
# For Apache
sudo nano /var/www/html/info.php

# For Nginx
sudo nano /var/www/html/info.php
```

Add the following content:

```php
<?php
phpinfo();
?>
```

Access the file through your web browser:
```
http://your-server-ip/info.php
```

**Security Note**: Remove this file after testing as it exposes system information.

## Essential PHP Extensions

### Database Extensions

```bash
# Ubuntu
sudo apt install php7.4-{mysql,pgsql,sqlite3} -y

# CentOS/RHEL
sudo yum install php-{mysqlnd,pgsql,sqlite} -y
```

### Caching Extensions

```bash
# Ubuntu
sudo apt install php7.4-{opcache,apcu,redis,memcached} -y

# CentOS/RHEL
sudo yum install php-{opcache,apcu,redis,memcached} -y
```

### Development Extensions

```bash
# Ubuntu
sudo apt install php7.4-{xdebug,dev} -y

# CentOS/RHEL
sudo yum install php-{xdebug,devel} -y
```

## Troubleshooting Common Issues

### Issue 1: PHP Not Working with Apache

**Solution**: Ensure the PHP module is enabled

```bash
# Ubuntu
sudo a2enmod php7.4
sudo systemctl restart apache2

# CentOS/RHEL
sudo systemctl restart httpd
```

### Issue 2: Permission Denied Errors

**Solution**: Check file permissions and ownership

```bash
# Set correct ownership
sudo chown -R www-data:www-data /var/www/html  # Ubuntu
sudo chown -R apache:apache /var/www/html      # CentOS/RHEL

# Set correct permissions
sudo chmod -R 755 /var/www/html
```

### Issue 3: PHP-FPM Not Starting

**Solution**: Check PHP-FPM configuration and logs

```bash
# Check PHP-FPM status
sudo systemctl status php7.4-fpm  # Ubuntu
sudo systemctl status php-fpm     # CentOS/RHEL

# Check error logs
sudo journalctl -u php7.4-fpm  # Ubuntu
sudo journalctl -u php-fpm     # CentOS/RHEL
```

### Issue 4: Memory Limit Errors

**Solution**: Increase PHP memory limit

```bash
# Edit PHP configuration
sudo nano /etc/php/7.4/apache2/php.ini  # Ubuntu
sudo nano /etc/php.ini                   # CentOS/RHEL

# Modify memory_limit
memory_limit = 512M

# Restart web server
sudo systemctl restart apache2  # or nginx
```

## Performance Optimization

### Enable OPcache

OPcache improves PHP performance by storing precompiled script bytecode in memory:

```ini
# Add to php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
```

### PHP-FPM Optimization

For Nginx setups, optimize PHP-FPM settings:

```bash
sudo nano /etc/php/7.4/fpm/pool.d/www.conf  # Ubuntu
sudo nano /etc/php-fpm.d/www.conf           # CentOS/RHEL
```

```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

## Security Best Practices

### Disable Dangerous Functions

```ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,parse_ini_file,show_source
```

### Hide PHP Version

```ini
expose_php = Off
```

### Enable Error Logging

```ini
log_errors = On
error_log = /var/log/php_errors.log
display_errors = Off
```

## Maintenance and Updates

### Updating PHP on Ubuntu

```bash
sudo apt update && sudo apt upgrade php7.4*
```

### Updating PHP on CentOS/RHEL

```bash
# CentOS/RHEL 7
sudo yum update php*

# CentOS/RHEL 8
sudo dnf update php*
```

### Managing Multiple PHP Versions

You can install multiple PHP versions and switch between them:

```bash
# Ubuntu - Install multiple versions
sudo apt install php7.4 php8.0 php8.1

# Switch default CLI version
sudo update-alternatives --config php

# Switch Apache module version
sudo a2dismod php7.4 && sudo a2enmod php8.0
sudo systemctl restart apache2
```

## Conclusion

PHP 7.4 remains one of the most popular programming languages for web development due to its ease of use, extensive ecosystem, and robust performance. This guide has provided comprehensive instructions for installing PHP 7.4 on both Ubuntu and CentOS/RHEL systems.

### Key Takeaways

- **Ubuntu users** can install PHP 7.4 directly from default repositories (20.04+) or via PPA for older versions
- **CentOS/RHEL users** need to enable EPEL and Remi repositories before installation
- **Proper configuration** is essential for security and performance
- **Regular updates** help maintain security and stability

### Next Steps

After successfully installing PHP 7.4, consider:

1. **Installing a PHP framework** like Laravel, Symfony, or CodeIgniter
2. **Setting up a development environment** with tools like Composer and Xdebug
3. **Implementing security measures** like firewalls and SSL certificates
4. **Monitoring performance** with tools like New Relic or Datadog

Whether you're building a simple website or a complex web application, PHP 7.4 provides the foundation for creating dynamic, interactive web experiences. With the knowledge gained from this guide, you're ready to start developing with PHP on your preferred Linux distribution.