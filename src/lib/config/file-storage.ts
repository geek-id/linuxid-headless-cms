import fs from 'fs';
import path from 'path';

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  defaultSEO: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterHandle?: string;
  };
  adminEmails: string[];
  theme: {
    primaryColor: string;
    logo?: string;
    favicon?: string;
  };
  features: {
    enableComments: boolean;
    enableAnalytics: boolean;
    enableSearch: boolean;
  };
}

export interface AdminSettings {
  uploadSettings: {
    maxFileSize: number;
    allowedImageTypes: string[];
    imageQuality: number;
  };
  contentSettings: {
    defaultContentType: 'post' | 'page' | 'review';
    enableDrafts: boolean;
    autoSave: boolean;
  };
  seoSettings: {
    enableSitemap: boolean;
    enableRobots: boolean;
    enableAnalytics: boolean;
    analyticsId?: string;
  };
}

const CONFIG_DIR = path.join(process.cwd(), '.config');
const SITE_CONFIG_PATH = path.join(CONFIG_DIR, 'site.json');
const ADMIN_CONFIG_PATH = path.join(CONFIG_DIR, 'admin.json');

// Ensure config directory exists
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// Default configurations
const defaultSiteConfig: SiteConfig = {
  siteName: process.env.SITE_NAME || 'LinuxID Headless CMS',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  description: 'A modern headless CMS built with Next.js',
  defaultSEO: {
    title: 'LinuxID Headless CMS',
    description: 'Modern, SEO-optimized headless CMS with cloud storage',
    keywords: ['cms', 'headless', 'nextjs', 'markdown', 'seo'],
  },
  adminEmails: process.env.ADMIN_EMAILS?.split(',') || [],
  theme: {
    primaryColor: '#3b82f6',
  },
  features: {
    enableComments: false,
    enableAnalytics: false,
    enableSearch: true,
  },
};

const defaultAdminConfig: AdminSettings = {
  uploadSettings: {
    maxFileSize: parseInt(process.env.MAX_IMAGE_SIZE || '10485760'),
    allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
    imageQuality: parseInt(process.env.IMAGE_QUALITY || '85'),
  },
  contentSettings: {
    defaultContentType: 'post',
    enableDrafts: true,
    autoSave: true,
  },
  seoSettings: {
    enableSitemap: true,
    enableRobots: true,
    enableAnalytics: false,
  },
};

// Load configuration from file
function loadConfig<T>(filePath: string, defaultConfig: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(fileContent);
      return { ...defaultConfig, ...config };
    }
  } catch (error) {
    console.warn(`Failed to load config from ${filePath}:`, error);
  }
  return defaultConfig;
}

// Save configuration to file
function saveConfig<T>(filePath: string, config: T): void {
  try {
    ensureConfigDir();
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error(`Failed to save config to ${filePath}:`, error);
    throw error;
  }
}

// Site configuration functions
export function getSiteConfig(): SiteConfig {
  return loadConfig(SITE_CONFIG_PATH, defaultSiteConfig);
}

export function updateSiteConfig(updates: Partial<SiteConfig>): void {
  const currentConfig = getSiteConfig();
  const newConfig = { ...currentConfig, ...updates };
  saveConfig(SITE_CONFIG_PATH, newConfig);
}

// Admin configuration functions
export function getAdminConfig(): AdminSettings {
  return loadConfig(ADMIN_CONFIG_PATH, defaultAdminConfig);
}

export function updateAdminConfig(updates: Partial<AdminSettings>): void {
  const currentConfig = getAdminConfig();
  const newConfig = { ...currentConfig, ...updates };
  saveConfig(ADMIN_CONFIG_PATH, newConfig);
}

// Admin user management (file-based)
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const config = getSiteConfig();
  return config.adminEmails.includes(email);
}

export function addAdminUser(email: string): void {
  const config = getSiteConfig();
  if (!config.adminEmails.includes(email)) {
    config.adminEmails.push(email);
    updateSiteConfig(config);
  }
}

export function removeAdminUser(email: string): void {
  const config = getSiteConfig();
  config.adminEmails = config.adminEmails.filter(admin => admin !== email);
  updateSiteConfig(config);
}

export function getAdminUsers(): string[] {
  const config = getSiteConfig();
  return config.adminEmails;
}

// Reset configurations to defaults
export function resetSiteConfig(): void {
  saveConfig(SITE_CONFIG_PATH, defaultSiteConfig);
}

export function resetAdminConfig(): void {
  saveConfig(ADMIN_CONFIG_PATH, defaultAdminConfig);
}

// Backup and restore functions
export function backupConfigs(): { site: SiteConfig; admin: AdminSettings } {
  return {
    site: getSiteConfig(),
    admin: getAdminConfig(),
  };
}

export function restoreConfigs(backup: { site: SiteConfig; admin: AdminSettings }): void {
  saveConfig(SITE_CONFIG_PATH, backup.site);
  saveConfig(ADMIN_CONFIG_PATH, backup.admin);
}

// Initialize configs on first run
export function initializeConfigs(): void {
  ensureConfigDir();
  
  // Create default configs if they don't exist
  if (!fs.existsSync(SITE_CONFIG_PATH)) {
    saveConfig(SITE_CONFIG_PATH, defaultSiteConfig);
  }
  
  if (!fs.existsSync(ADMIN_CONFIG_PATH)) {
    saveConfig(ADMIN_CONFIG_PATH, defaultAdminConfig);
  }
} 