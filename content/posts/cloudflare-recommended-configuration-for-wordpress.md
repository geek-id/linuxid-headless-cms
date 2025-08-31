---
title: "Recommended Cloudflare Configuration for WordPress Users"
slug: "recommended-cloudflare-configuration-for-wordpress-users"
excerpt: "Discover the best Cloudflare settings for WordPress sites to maximize speed, security, and reliability. This step-by-step guide covers blogs, business sites, and WooCommerce stores."
published: true
publishedAt: "2024-05-10T10:00:00Z"
author: "Linux-ID Team"
template: "post"
featured: true
featuredImage: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&w=1200&q=80"
category: "WordPress"
tags: ["cloudflare", "wordpress", "cdn", "security", "performance", "optimization", "web-development", "blog"]
seo:
  title: "Recommended Cloudflare Configuration for WordPress (2024 Guide)"
  description: "A step-by-step guide to the best Cloudflare settings for WordPress. Improve speed, security, and uptime for your WordPress blog, business site, or WooCommerce store."
  keywords: ["cloudflare wordpress", "cloudflare settings", "wordpress optimization", "wordpress security", "cdn for wordpress", "cloudflare guide", "wordpress performance"]
  canonical: "https://linux-id.net/posts/recommended-cloudflare-configuration-for-wordpress-users"
---

# Recommended Cloudflare Configuration for WordPress Users

Cloudflare is a powerful CDN and security platform that can dramatically improve the speed, security, and reliability of your WordPress site. This guide provides a production-ready, step-by-step configuration for WordPress blogs, business sites, and WooCommerce stores.

## Why Use Cloudflare for WordPress?
- **Global CDN**: Faster load times for visitors worldwide
- **DDoS Protection**: Shields your site from attacks
- **SSL/TLS**: Free HTTPS for all sites
- **Caching**: Reduces server load and speeds up delivery
- **Firewall Rules**: Blocks malicious traffic
- **Image Optimization**: Automatic compression and WebP support
- **Bot Management**: Stops bad bots, lets good bots in

## Prerequisites
- A live WordPress site (self-hosted)
- Access to your domain DNS settings
- Free Cloudflare account ([Sign up here](https://dash.cloudflare.com/sign-up))

## Step 1: Add Your Site to Cloudflare
1. Sign in to Cloudflare and click **Add a Site**
2. Enter your domain (e.g., `yourdomain.com`)
3. Choose the **Free** plan (or higher if needed)
4. Cloudflare will scan your DNS records—review and confirm
5. Update your domain's nameservers to the ones provided by Cloudflare
6. Wait for DNS propagation (usually minutes to a few hours)

## Step 2: Essential DNS & Security Settings
- **A Record**: Points to your server's IP
- **CNAME**: For `www` and other subdomains
- **Mail (MX) Records**: Set to DNS only (not proxied)
- **Proxy Status**: Orange cloud (proxied) for web traffic, gray cloud (DNS only) for mail/FTP
- **DNSSEC**: Enable for DNS security

## Step 3: SSL/TLS Best Practices
- **SSL Mode**: Always use **Full (Strict)** for maximum security (never use Flexible)
- **Origin Certificates**: Use Cloudflare Origin Certificates or a public CA (e.g., Let's Encrypt)
- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: Enable only if you have mixed content; otherwise, disable for performance
- **HSTS**: Enable for extra security (advanced users)
- **TLS 1.3**: ON
- **Minimum TLS Version**: Set to 1.2 or higher

## Step 4: Speed & Performance Optimization
- **Speed Observatory**: Enable daily testing to monitor performance
- **Image Optimization**:
  - **Polish**: Enable for image compression unless you already serve WebP/AVIF from origin
  - **Mirage**: Enable for mobile/image-heavy sites
- **Protocol Optimization**:
  - **HTTP/2 & HTTP/3**: Enable both
  - **HTTP/2 to Origin**: Enable if your origin supports it
  - **Enhanced HTTP/2 Prioritization**: Enable for optimal resource delivery
  - **Brotli Compression**: ON
  - **0-RTT Connection Resumption**: ON
- **Tiered Cache Topology**: Enable for global audiences
- **Argo Smart Routing**: Consider enabling for international traffic (paid feature)
- **Auto Minify**: Enable for JavaScript, CSS, HTML
- **Rocket Loader**: Test with your theme/plugins; disable if you see JS issues or use modern JS frameworks
- **Development Mode**: Use only when making changes to your site

## Step 5: Caching & Rules
- **Caching Level**: Standard
- **Browser Cache TTL**: 1 day (or longer for static sites)
- **Always Online**: ON
- **Purge Cache**: After major updates or theme/plugin changes
- **Page Rules / New Rulesets**: Use new rulesets for fine-tuned caching and security (Page Rules are being phased out)
  - **Cache Everything for Static Assets**: `/wp-content/*` (Cache Level: Cache Everything, Edge Cache TTL: 1 month)
  - **Bypass Cache for Admin and Login**: `/wp-admin*`, `/wp-login.php*` (Cache Level: Bypass)
  - **Bypass Cache for WooCommerce**: `/cart*`, `/checkout*`, `/my-account*` (Cache Level: Bypass)
  - **Always Use HTTPS**: `/*` (Always Use HTTPS)

## Step 6: Firewall & Security
- **WAF (Web Application Firewall)**: ON (Free plan includes basic rules)
- **WordPress-specific rules**: Enable OWASP and WordPress rulesets
- **Custom WAF Rules for WordPress**:
  - Block access to sensitive paths unless referer is your own site:
    ```
    (http.request.uri.path in {"/wp-register.php" "/wp-admin/" "/install.php" "/theme-editor.php" "/wp-config.php" "/backup/" "/wp-backup/" "/upgrade.php" "/xmlrpc.php"} and not http.referer contains "yourdomain.com")
    ```
  - Country filtering and login protection:
    ```
    (ip.geoip.country in {"XX" "YY"} and cf.threat_score ge 5) or (http.request.uri.path contains "/wp-login.php")
    ```
    Replace `XX`, `YY` with country codes as needed.
- **Rate Limiting**: Protect login and XML-RPC endpoints
- **Bot Fight Mode**: ON
- **Browser Integrity Check**: ON
- **Challenge suspicious countries/IPs**: Optional, for extra security

## Step 7: WordPress Plugin Settings
- **Cloudflare Official Plugin**: Install and connect to your account
- **Automatic Cache Purge**: Enable for post/page updates
- **APO (Automatic Platform Optimization)**: Highly recommended for best performance (paid feature)

## Step 8: Best Practices & Troubleshooting
- **Test your site** after each change
- **Check Cloudflare Analytics** for traffic and threat reports
- **Use Development Mode** when making design changes
- **Purge cache** if you see outdated content
- **Review Firewall Events** for blocked requests
- **Disable Rocket Loader** if you see JS issues or use modern JS frameworks
- **Regularly review and update your rules and settings** as Cloudflare evolves

## Advanced Tips
- **Custom Firewall Rules**: Block XML-RPC, restrict admin by IP
- **Workers**: Use for advanced edge logic (paid feature)
- **Log real visitor IPs**: Configure your server to restore original IPs from Cloudflare headers
- **Monitor uptime**: Use Cloudflare's free monitoring or third-party tools
- **Fail2Ban Integration**: Use Fail2Ban with Cloudflare API for automated blocking

## Conclusion
With these recommended Cloudflare settings, your WordPress site will be faster, more secure, and more reliable. Adjust settings as needed for your specific plugins, themes, and business needs. For advanced configurations, consult [Cloudflare's WordPress documentation](https://developers.cloudflare.com/wordpress/).