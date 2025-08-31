---
title: "How to Install Google PageSpeed Module on Nginx - Complete Guide"
slug: "install-pagespeed-nginx-complete-guide"
excerpt: "Learn how to install and configure Google PageSpeed module on Nginx to optimize website performance, reduce page load times, and improve user experience with automatic optimization of static assets."
published: true
publishedAt: "2020-08-15T10:30:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1"
category: "Web Server"
tags: ["nginx", "pagespeed", "performance", "optimization", "web-server", "google", "tutorial"]
seo:
  title: "Install Google PageSpeed Module on Nginx - Complete Tutorial 2020"
  description: "Complete guide to installing Google PageSpeed module on Nginx. Optimize website performance, reduce load times, and automatically minify CSS, JS, and HTML files."
  keywords: ["google pagespeed", "nginx pagespeed", "web optimization", "nginx modules", "page speed", "website performance", "nginx installation"]
  canonical: "https://linux-id.net/posts/install-pagespeed-nginx-complete-guide"
---

**Google PageSpeed Module** is a powerful web server optimization module for Nginx and Apache that automatically applies web performance best practices to pages and associated assets (CSS, JavaScript, images) without requiring you to modify your existing content or workflow. Originally developed by Google, this module helps reduce page load times and improves user experience through intelligent optimization techniques.

## What is Google PageSpeed Module?

The **Google PageSpeed Module** (mod_pagespeed for Apache, ngx_pagespeed for Nginx) is an open-source server module that automatically optimizes web pages to improve performance. It works by intercepting HTTP requests and responses, applying various optimization filters to reduce bandwidth usage and latency.

### Key Features of PageSpeed Module

- **Automatic Optimization**: No code changes required
- **CSS Minification**: Removes unnecessary whitespace and comments
- **JavaScript Minification**: Compresses JS files for faster loading
- **HTML Optimization**: Minifies HTML and optimizes structure
- **Image Optimization**: Converts and compresses images automatically
- **Resource Combination**: Combines multiple CSS/JS files into fewer requests
- **Caching**: Intelligent caching strategies for better performance
- **Lazy Loading**: Defers loading of below-the-fold content

### Performance Benefits

| Optimization Type | Performance Improvement |
|------------------|------------------------|
| **CSS Minification** | 10-30% size reduction |
| **JavaScript Minification** | 20-40% size reduction |
| **Image Optimization** | 20-80% size reduction |
| **HTML Minification** | 5-15% size reduction |
| **Resource Combination** | Reduced HTTP requests |

## Prerequisites

Before installing PageSpeed module, ensure your system meets the following requirements:

### System Requirements
- **CentOS/RHEL**: 7, 8, or newer
- **Ubuntu**: 18.04 LTS, 20.04 LTS, or newer
- **Nginx**: Version 1.16+ (recommended)
- **RAM**: Minimum 1GB (2GB+ recommended for production)
- **Root or sudo access**: Administrative privileges required

### Supported Architectures
- x86_64 (64-bit Intel/AMD)
- ARM64 (for newer ARM-based systems)

## Installation Methods

There are two main approaches to install PageSpeed with Nginx:

1. **Dynamic Module Installation** (Recommended for existing Nginx)
2. **Compile from Source** (For custom builds and maximum control)

This guide focuses on the dynamic module installation method, which is simpler and more maintainable.

## Installing PageSpeed Module on Nginx

### Step 1: Install Required Dependencies

First, install the necessary development tools and libraries:

#### For CentOS/RHEL/AlmaLinux

```bash
# Install EPEL repository (if not already installed)
sudo yum install epel-release -y

# Install build dependencies
sudo yum groupinstall "Development Tools" -y
sudo yum install openssl-devel libxslt-devel perl-devel perl-ExtUtils-Embed \
    gd-devel geoip-devel gperftools-devel libuuid-devel \
    gcc-c++ unzip wget curl -y
```

#### For Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install build dependencies
sudo apt install build-essential zlib1g-dev libpcre3-dev libssl-dev \
    libxslt1-dev libgd-dev libgeoip-dev libgoogle-perftools-dev \
    uuid-dev gcc g++ unzip wget curl -y
```

### Step 2: Download and Install PageSpeed

Download the official PageSpeed installation script and run it:

```bash
# Download the automatic installation script
wget https://github.com/apache/incubator-pagespeed-ngx/archive/latest-stable.zip

# Unzip the downloaded file
unzip latest-stable.zip

# Navigate to the directory
cd incubator-pagespeed-ngx-latest-stable

# Make the installation script executable
chmod +x scripts/format_binary_url.sh

# Download PageSpeed optimization library
PSOL_URL=$(scripts/format_binary_url.sh PSOL_BINARY_URL)
wget ${PSOL_URL}
tar -xzf $(basename ${PSOL_URL})
```

### Step 3: Configure Nginx with PageSpeed

During the installation process, you'll be prompted to add additional configure arguments. Use the following comprehensive configuration:

```bash
# Nginx configuration with PageSpeed module
--prefix=/usr/share/nginx \
--sbin-path=/usr/sbin/nginx \
--modules-path=/usr/lib64/nginx/modules \
--conf-path=/etc/nginx/nginx.conf \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--http-client-body-temp-path=/var/lib/nginx/tmp/client_body \
--http-proxy-temp-path=/var/lib/nginx/tmp/proxy \
--http-fastcgi-temp-path=/var/lib/nginx/tmp/fastcgi \
--http-uwsgi-temp-path=/var/lib/nginx/tmp/uwsgi \
--http-scgi-temp-path=/var/lib/nginx/tmp/scgi \
--pid-path=/run/nginx.pid \
--lock-path=/run/lock/subsys/nginx \
--user=nginx \
--group=nginx \
--with-file-aio \
--with-ipv6 \
--with-http_auth_request_module \
--with-http_ssl_module \
--with-http_v2_module \
--with-http_realip_module \
--with-http_addition_module \
--with-http_xslt_module=dynamic \
--with-http_image_filter_module=dynamic \
--with-http_geoip_module=dynamic \
--with-http_sub_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_mp4_module \
--with-http_gunzip_module \
--with-http_gzip_static_module \
--with-http_random_index_module \
--with-http_secure_link_module \
--with-http_degradation_module \
--with-http_slice_module \
--with-http_stub_status_module \
--with-http_perl_module=dynamic \
--with-mail=dynamic \
--with-mail_ssl_module \
--with-pcre \
--with-pcre-jit \
--with-stream=dynamic \
--with-stream_ssl_module \
--with-google_perftools_module \
--with-debug \
--add-module=/path/to/incubator-pagespeed-ngx-latest-stable
```

### Step 4: Complete the Installation

After entering the configuration, the installation will proceed automatically. You'll see output similar to:

```
Configuration summary
  + using system PCRE library
  + using system OpenSSL library
  + using system zlib library
  + PageSpeed module added

  nginx path prefix: "/etc/nginx"
  nginx binary file: "/usr/sbin/nginx"
  nginx modules path: "/usr/lib/nginx/modules"
  nginx configuration prefix: "/etc/nginx"
  nginx configuration file: "/etc/nginx/nginx.conf"
  nginx pid file: "/var/run/nginx.pid"
  nginx error log file: "/var/log/nginx/error.log"
  nginx http access log file: "/var/log/nginx/access.log"

Build nginx? [Y/n] Y
```

Type `Y` and press Enter to complete the installation.

## Configuring PageSpeed in Virtual Hosts

### Step 1: Create PageSpeed Cache Directory

Create the necessary cache directory for PageSpeed:

```bash
# Create cache directory
sudo mkdir -p /var/cache/ngx_pagespeed/

# Set proper ownership
sudo chown nginx:nginx /var/cache/ngx_pagespeed/

# Set proper permissions
sudo chmod 755 /var/cache/ngx_pagespeed/
```

### Step 2: Basic PageSpeed Configuration

Add PageSpeed configuration to your virtual host file:

```bash
sudo nano /etc/nginx/conf.d/yourdomain.conf
```

Add the following configuration within your server block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Enable PageSpeed
    pagespeed on;
    
    # Set cache directory
    pagespeed FileCachePath "/var/cache/ngx_pagespeed/";
    
    # Set optimization level
    pagespeed RewriteLevel OptimizeForBandwidth;
    
    # Enable specific filters
    pagespeed EnableFilters combine_css;
    pagespeed EnableFilters combine_javascript;
    pagespeed EnableFilters minify_css;
    pagespeed EnableFilters minify_javascript;
    pagespeed EnableFilters minify_html;
    pagespeed EnableFilters remove_comments;
    pagespeed EnableFilters collapse_whitespace;
    pagespeed EnableFilters remove_quotes;
    
    # Image optimization
    pagespeed EnableFilters rewrite_images;
    pagespeed EnableFilters convert_png_to_jpeg;
    pagespeed EnableFilters convert_gif_to_png;
    pagespeed EnableFilters convert_jpeg_to_webp;
    pagespeed EnableFilters recompress_images;
    
    # Cache optimization
    pagespeed EnableFilters extend_cache;
    pagespeed EnableFilters rewrite_css;
    pagespeed EnableFilters rewrite_javascript;
    
    # Required PageSpeed locations
    location ~ "\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+" {
        add_header "" "";
    }
    
    location ~ "^/pagespeed_static/" { }
    location ~ "^/ngx_pagespeed_beacon$" { }
    location ~ "^/ngx_pagespeed_statistics$" { }
    location ~ "^/ngx_pagespeed_global_statistics$" { }
    location ~ "^/ngx_pagespeed_message$" { }
    location ~ "^/pagespeed_console$" { }
    location ~ "^/pagespeed_admin/" { }
    
    # Your website content
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Step 3: Advanced PageSpeed Configuration

For production environments, use this enhanced configuration:

```nginx
# Advanced PageSpeed configuration
pagespeed on;
pagespeed FileCachePath "/var/cache/ngx_pagespeed/";

# Set cache size (adjust based on your needs)
pagespeed FileCacheSizeKb 102400;  # 100MB
pagespeed FileCacheCleanIntervalMs 3600000;  # 1 hour

# Optimization level
pagespeed RewriteLevel OptimizeForBandwidth;

# Core filters for maximum optimization
pagespeed EnableFilters add_head;
pagespeed EnableFilters combine_css;
pagespeed EnableFilters combine_javascript;
pagespeed EnableFilters convert_meta_tags;
pagespeed EnableFilters extend_cache;
pagespeed EnableFilters fallback_rewrite_css_urls;
pagespeed EnableFilters flatten_css_imports;
pagespeed EnableFilters inline_css;
pagespeed EnableFilters inline_import_to_link;
pagespeed EnableFilters inline_javascript;
pagespeed EnableFilters inline_preview_images;
pagespeed EnableFilters insert_dns_prefetch;
pagespeed EnableFilters minify_css;
pagespeed EnableFilters minify_html;
pagespeed EnableFilters minify_javascript;
pagespeed EnableFilters prioritize_critical_css;
pagespeed EnableFilters remove_comments;
pagespeed EnableFilters remove_quotes;
pagespeed EnableFilters rewrite_css;
pagespeed EnableFilters rewrite_images;
pagespeed EnableFilters rewrite_javascript;
pagespeed EnableFilters rewrite_style_attributes;

# Image optimization filters
pagespeed EnableFilters convert_gif_to_png;
pagespeed EnableFilters convert_jpeg_to_progressive;
pagespeed EnableFilters convert_png_to_jpeg;
pagespeed EnableFilters convert_jpeg_to_webp;
pagespeed EnableFilters convert_to_webp_lossless;
pagespeed EnableFilters strip_image_color_profile;
pagespeed EnableFilters strip_image_meta_data;
pagespeed EnableFilters jpeg_subsampling;
pagespeed EnableFilters recompress_images;
pagespeed EnableFilters recompress_png;
pagespeed EnableFilters recompress_webp;
pagespeed EnableFilters resize_images;
pagespeed EnableFilters resize_rendered_image_dimensions;

# Disable specific filters if needed
# pagespeed DisableFilters rewrite_images;

# Set image quality (80 is good balance between quality and size)
pagespeed ImageRecompressionQuality 80;

# Respect origin headers
pagespeed RespectXForwardedProto on;

# Statistics and admin interface (optional - enable only for testing)
# pagespeed Statistics on;
# pagespeed StatisticsLogging on;
# pagespeed LogDir /var/log/pagespeed;
```

### Step 4: Validate Configuration

Test your Nginx configuration for syntax errors:

```bash
# Test configuration
sudo nginx -t

# If no errors, reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

## Testing PageSpeed Installation

### Method 1: HTTP Headers Check

Use curl to check if PageSpeed headers are present:

```bash
curl -I https://yourdomain.com
```

Look for the `X-Page-Speed` header in the response:

```
HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: text/html; charset=UTF-8
X-Page-Speed: 1.13.35.2-0
Cache-Control: max-age=0, no-cache
Date: Sat, 15 Aug 2020 10:30:00 GMT
```

### Method 2: Browser Developer Tools

1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Refresh the page
5. Check the Response Headers for `X-Page-Speed`

### Method 3: PageSpeed Test Tools

Use online tools to verify optimization:

- **Google PageSpeed Insights**: https://developers.google.com/speed/pagespeed/insights/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

## Performance Monitoring and Optimization

### Monitoring PageSpeed Performance

Create a monitoring script to track performance:

```bash
#!/bin/bash
# PageSpeed monitoring script

DOMAIN="yourdomain.com"
LOG_FILE="/var/log/pagespeed-monitor.log"

echo "$(date): Checking PageSpeed status for $DOMAIN" >> $LOG_FILE

# Check if PageSpeed header is present
PAGESPEED_HEADER=$(curl -s -I https://$DOMAIN | grep -i "x-page-speed")

if [ -n "$PAGESPEED_HEADER" ]; then
    echo "$(date): PageSpeed is active - $PAGESPEED_HEADER" >> $LOG_FILE
else
    echo "$(date): WARNING - PageSpeed header not found" >> $LOG_FILE
fi

# Check cache directory size
CACHE_SIZE=$(du -sh /var/cache/ngx_pagespeed/ | cut -f1)
echo "$(date): Cache directory size: $CACHE_SIZE" >> $LOG_FILE
```

### Cache Management

Regular cache maintenance commands:

```bash
# Check cache size
du -sh /var/cache/ngx_pagespeed/

# Clear PageSpeed cache (if needed)
sudo rm -rf /var/cache/ngx_pagespeed/*

# Restart Nginx to rebuild cache
sudo systemctl restart nginx
```

## Troubleshooting Common Issues

### Issue 1: PageSpeed Module Not Loading

**Symptoms**: No `X-Page-Speed` header in response

**Solutions**:

```bash
# Check if PageSpeed module is compiled
nginx -V 2>&1 | grep -o with-pagespeed

# Verify cache directory permissions
ls -la /var/cache/ngx_pagespeed/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue 2: High CPU Usage

**Solutions**:

```bash
# Reduce optimization level
pagespeed RewriteLevel PassThrough;

# Disable CPU-intensive filters
pagespeed DisableFilters rewrite_images;
pagespeed DisableFilters convert_jpeg_to_webp;
```

### Issue 3: Broken Website Layout

**Solutions**:

```bash
# Disable CSS/JS combination temporarily
pagespeed DisableFilters combine_css;
pagespeed DisableFilters combine_javascript;

# Test individual filters to identify the problematic one
```

### Issue 4: Cache Directory Fills Up

**Solutions**:

```bash
# Set cache size limit
pagespeed FileCacheSizeKb 51200;  # 50MB

# Set cleanup interval
pagespeed FileCacheCleanIntervalMs 1800000;  # 30 minutes

# Create cleanup cron job
echo "0 */6 * * * root find /var/cache/ngx_pagespeed -type f -mtime +1 -delete" >> /etc/crontab
```

## Security Considerations

### Protecting PageSpeed Admin Interface

If you enable the admin interface, secure it properly:

```nginx
# Restrict admin access by IP
location ~ "^/pagespeed_admin/" {
    allow 192.168.1.0/24;  # Your admin network
    allow 127.0.0.1;       # Localhost
    deny all;
    
    # Optional: Add HTTP basic auth
    auth_basic "PageSpeed Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Content Security Policy

Update your CSP headers to allow PageSpeed optimizations:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
```

## Best Practices

### 1. Start with Conservative Settings

Begin with basic optimizations and gradually enable more filters:

```nginx
# Basic safe configuration
pagespeed EnableFilters minify_css;
pagespeed EnableFilters minify_javascript;
pagespeed EnableFilters minify_html;
pagespeed EnableFilters remove_comments;
```

### 2. Test Thoroughly

Always test your website functionality after enabling new filters:

- Check all pages and forms
- Verify JavaScript functionality
- Test on different browsers and devices
- Monitor error logs

### 3. Monitor Performance

Set up monitoring for:
- Page load times
- Server resource usage
- Cache hit rates
- Error rates

### 4. Regular Maintenance

Perform regular maintenance tasks:

```bash
# Weekly cache cleanup
find /var/cache/ngx_pagespeed -type f -mtime +7 -delete

# Monthly performance review
grep "pagespeed" /var/log/nginx/error.log | tail -100

# Quarterly configuration review
nginx -T | grep pagespeed
```

## Conclusion

Installing Google PageSpeed module on Nginx is an excellent way to automatically optimize your website's performance without requiring changes to your application code. The module provides significant performance improvements through intelligent optimization of static assets, reduced bandwidth usage, and faster page load times.

### Key Benefits Achieved

- **Reduced Page Load Times**: Automatic minification and optimization
- **Lower Bandwidth Usage**: Compressed and optimized assets
- **Improved User Experience**: Faster loading pages and better performance scores
- **SEO Benefits**: Better Core Web Vitals and search engine rankings
- **Automatic Optimization**: No code changes required

### Performance Impact

Websites typically see:
- **20-40% reduction** in page size
- **15-30% improvement** in load times
- **Better Google PageSpeed scores**
- **Improved user engagement metrics**

With proper configuration and monitoring, Google PageSpeed module can significantly enhance your website's performance while maintaining reliability and functionality. Regular monitoring and optimization ensure continued benefits as your website grows and evolves.

For production environments, start with conservative settings and gradually enable more aggressive optimizations based on your testing results and performance requirements. 