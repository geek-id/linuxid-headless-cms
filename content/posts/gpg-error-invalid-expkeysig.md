---
title: "GPG Error: Invalid EXPKEYSIG - Complete Solution Guide"
slug: "gpg-error-invalid-expkeysig"
excerpt: "Comprehensive guide to resolving GPG Error Invalid EXPKEYSIG issues in Linux. Learn modern solutions, security best practices, and troubleshooting techniques for expired GPG keys in apt repositories."
published: true
publishedAt: "2020-02-26T06:23:36Z"
author: "Linux-ID Team"
category: "Security"
template: "post"
featured: false
featuredImage: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200"
tags: ["security", "linux", "gpg", "apt", "troubleshooting"]
seo:
  title: "GPG Error: Invalid EXPKEYSIG - Complete Solution Guide"
  description: "Learn how to fix GPG Error Invalid EXPKEYSIG in Linux. Comprehensive guide covering modern solutions, security best practices, and troubleshooting for expired GPG keys in apt repositories."
  keywords: ["gpg error", "expkeysig", "linux security", "apt repository", "gpg keys", "ubuntu", "debian", "troubleshooting"]
  canonical: "https://linux-id.net/posts/gpg-error-invalid-expkeysig"
---

## Introduction

Have you ever encountered the **GPG Error Invalid EXPKEYSIG** message after adding a repository and running an update? This error typically appears like this:

```
W: GPG error: http://repo.mysql.com/apt/ubuntu bionic InRelease: The following signatures were invalid: EXPKEYSIG 8C718D3B5072E1F5 MySQL Release Engineering 
E: The repository 'http://repo.mysql.com/apt/ubuntu bionic InRelease' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

This error occurs when the GPG (GNU Privacy Guard) key used to sign a repository has expired. GPG keys are cryptographic signatures that ensure the authenticity and integrity of software packages. When a key expires, the system can no longer verify that the packages come from a trusted source, triggering this security warning.

## Understanding GPG Key Expiration

### What Causes EXPKEYSIG Errors?

1. **Key Expiration**: GPG keys have expiration dates for security purposes
2. **Repository Updates**: Maintainers may update their signing keys
3. **Security Policies**: Organizations rotate keys regularly to maintain security
4. **System Clock Issues**: Incorrect system time can cause valid keys to appear expired

### Security Implications

The apt package manager uses GPG signatures to:
- Verify package authenticity
- Ensure packages haven't been tampered with
- Confirm packages come from trusted sources
- Prevent man-in-the-middle attacks

## Modern Solutions for GPG Key Management

### Method 1: Using the Recommended `signed-by` Approach (Preferred)

The modern and secure way to handle GPG keys is using the `signed-by` parameter in repository definitions:

```bash
# Download and save the key
curl -fsSL https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 | sudo gpg --dearmor -o /etc/apt/keyrings/mysql.gpg

# Add repository with signed-by parameter
echo "deb [signed-by=/etc/apt/keyrings/mysql.gpg] http://repo.mysql.com/apt/ubuntu $(lsb_release -cs) mysql-8.0" | sudo tee /etc/apt/sources.list.d/mysql.list

# Update package lists
sudo apt update
```

### Method 2: Using Keyserver (Legacy but Still Functional)

If you need to use the traditional keyserver approach:

```bash
# Extract the key ID from the error message (8C718D3B5072E1F5 in this example)
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8C718D3B5072E1F5

# Alternative keyservers if the first one fails
sudo apt-key adv --keyserver keys.gnupg.net --recv-keys 8C718D3B5072E1F5
sudo apt-key adv --keyserver pgp.mit.edu --recv-keys 8C718D3B5072E1F5

# Update package lists
sudo apt update
```

### Method 3: Direct Key Download

For repositories that provide direct key downloads:

```bash
# Download key directly from the repository
wget -qO - https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 | sudo apt-key add -

# Or using the modern approach
wget -qO - https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 | sudo tee /etc/apt/trusted.gpg.d/mysql.asc
```

## Troubleshooting Common Issues

### Issue 1: Multiple Key Conflicts

If you have duplicate keys in different keyrings:

```bash
# Remove old expired keys
sudo apt-key del 8C718D3B5072E1F5

# List all keys to verify removal
sudo apt-key list | grep 8C718D3B5072E1F5

# Reinstall the repository package if available
sudo apt install --reinstall mysql-apt-config
```

### Issue 2: Repository-Specific Solutions

Different repositories may require specific approaches:

**For MySQL:**
```bash
# Download MySQL APT configuration package
wget https://dev.mysql.com/get/mysql-apt-config_0.8.24-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.24-1_all.deb
sudo apt update
```

**For Docker:**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
```

### Issue 3: Verifying Key Authenticity

Always verify keys before adding them:

```bash
# Check key details
gpg --show-keys /path/to/keyfile

# Verify key fingerprint against official documentation
gpg --with-fingerprint /etc/apt/keyrings/mysql.gpg
```

## Best Practices for GPG Key Management

### 1. Use Modern Key Management
- Prefer `signed-by` parameter over system-wide keyrings
- Store keys in `/etc/apt/keyrings/` directory
- Use descriptive filenames for key files

### 2. Regular Maintenance
- Monitor key expiration dates
- Set up automated key renewal where possible
- Keep backup copies of important keys

### 3. Security Considerations
- Always download keys from official sources
- Verify key fingerprints when possible
- Use HTTPS for key downloads
- Avoid adding keys from untrusted sources

## Advanced Troubleshooting

### Checking Key Expiration
```bash
# List all keys with expiration dates
sudo apt-key list

# Check specific key details
gpg --list-keys --with-colons | grep -A1 "8C718D3B5072E1F5"
```

### Cleaning Up Old Keys
```bash
# Remove all expired keys
sudo apt-key list | grep expired | cut -d'/' -f2 | cut -d' ' -f1 | xargs -I {} sudo apt-key del {}

# Clean apt cache
sudo apt clean
sudo apt autoclean
```

## Conclusion

GPG key expiration errors are common in Linux systems and are actually a sign that security mechanisms are working correctly. The key is to understand the proper modern methods for managing these keys securely.

**Key takeaways:**
1. Use the `signed-by` approach for new repositories
2. Always verify key authenticity before installation
3. Keep your system and keys updated regularly
4. Understand that key expiration is a security feature, not a bug

By following these practices, you'll maintain a secure system while avoiding GPG-related repository issues. Remember that while the `apt-key` command still works, it's deprecated and should be avoided in favor of the modern keyring management approach.