/**
 * Client-side cookie utilities for static site
 * Handles user preferences, analytics consent, and reading preferences
 */

export interface CookieOptions {
  expires?: number; // Days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieManager {
  private static defaultOptions: CookieOptions = {
    expires: 365, // 1 year default
    path: '/',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  /**
   * Set a cookie
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return; // SSR guard

    const opts = { ...this.defaultOptions, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.expires) {
      const expires = new Date();
      expires.setTime(expires.getTime() + opts.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (opts.path) cookieString += `; path=${opts.path}`;
    if (opts.domain) cookieString += `; domain=${opts.domain}`;
    if (opts.secure) cookieString += `; secure`;
    if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value
   */
  static get(name: string): string | null {
    if (typeof window === 'undefined') return null; // SSR guard

    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Remove a cookie
   */
  static remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', { 
      ...options, 
      expires: -1 
    });
  }

  /**
   * Check if cookies are enabled
   */
  static isEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const testCookie = 'linuxid_cookie_test';
      this.set(testCookie, 'test', { expires: 1 });
      const enabled = this.get(testCookie) === 'test';
      this.remove(testCookie);
      return enabled;
    } catch {
      return false;
    }
  }
}

/**
 * User preferences management
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  analyticsConsent: boolean;
  cookiesAccepted: boolean;
  readingProgress: boolean;
  emailSubscribed?: boolean;
}

export class PreferencesManager {
  private static readonly PREFS_KEY = 'linuxid_preferences';
  private static readonly CONSENT_KEY = 'linuxid_consent';

  private static defaultPreferences: UserPreferences = {
    theme: 'auto',
    fontSize: 'medium',
    analyticsConsent: false,
    cookiesAccepted: false,
    readingProgress: true,
  };

  /**
   * Get user preferences
   */
  static getPreferences(): UserPreferences {
    const stored = CookieManager.get(this.PREFS_KEY);
    if (!stored) return { ...this.defaultPreferences };

    try {
      const parsed = JSON.parse(stored);
      return { ...this.defaultPreferences, ...parsed };
    } catch {
      return { ...this.defaultPreferences };
    }
  }

  /**
   * Update user preferences
   */
  static setPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    
    CookieManager.set(this.PREFS_KEY, JSON.stringify(updated), {
      expires: 365 * 2, // 2 years for preferences
    });

    // Emit custom event for reactive updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('preferencesChanged', {
        detail: updated
      }));
    }
  }

  /**
   * Cookie consent management
   */
  static hasConsent(): boolean {
    return CookieManager.get(this.CONSENT_KEY) === 'true';
  }

  static setConsent(granted: boolean): void {
    CookieManager.set(this.CONSENT_KEY, granted.toString(), {
      expires: 365, // 1 year for consent
    });

    if (granted) {
      this.setPreferences({ 
        cookiesAccepted: true, 
        analyticsConsent: true 
      });
    }
  }

  /**
   * Reading progress tracking
   */
  static getReadingProgress(postId: string): number {
    const progress = CookieManager.get(`reading_${postId}`);
    return progress ? parseFloat(progress) : 0;
  }

  static setReadingProgress(postId: string, percentage: number): void {
    if (!this.getPreferences().readingProgress) return;
    
    CookieManager.set(`reading_${postId}`, percentage.toString(), {
      expires: 30, // 30 days for reading progress
    });
  }

  /**
   * Recently viewed posts
   */
  static addRecentlyViewed(postId: string, title: string): void {
    const recent = this.getRecentlyViewed();
    const updated = [
      { id: postId, title, timestamp: Date.now() },
      ...recent.filter(item => item.id !== postId)
    ].slice(0, 10); // Keep last 10

    CookieManager.set('linuxid_recent', JSON.stringify(updated), {
      expires: 30 // 30 days
    });
  }

  static getRecentlyViewed(): Array<{ id: string; title: string; timestamp: number }> {
    const stored = CookieManager.get('linuxid_recent');
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Clear all preferences and data
   */
  static clearAll(): void {
    CookieManager.remove(this.PREFS_KEY);
    CookieManager.remove(this.CONSENT_KEY);
    CookieManager.remove('linuxid_recent');
    
    // Clear reading progress cookies
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('reading_')) {
          CookieManager.remove(name);
        }
      });
    }
  }
}

/**
 * Analytics and tracking utilities
 */
export class AnalyticsManager {
  /**
   * Track page view (only if consent given)
   */
  static trackPageView(path: string, title: string): void {
    const prefs = PreferencesManager.getPreferences();
    if (!prefs.analyticsConsent) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href,
      });
    }

    // Custom analytics event
    this.trackEvent('page_view', {
      page_path: path,
      page_title: title,
    });
  }

  /**
   * Track custom events
   */
  static trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    const prefs = PreferencesManager.getPreferences();
    if (!prefs.analyticsConsent) return;

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, parameters);
    }
  }
}

// Export utilities for easy use
export const cookies = CookieManager;
export const preferences = PreferencesManager;
export const analytics = AnalyticsManager; 