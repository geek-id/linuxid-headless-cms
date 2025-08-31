'use client';

import { useState, useEffect } from 'react';
import { preferences } from '@/lib/utils/cookies';

interface CookieConsentProps {
  className?: string;
}

export default function CookieConsent({ className = '' }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already given consent
    const hasConsent = preferences.hasConsent();
    const prefs = preferences.getPreferences();
    
    // Show banner if no consent given and cookies not explicitly declined
    if (!hasConsent && !prefs.cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    preferences.setConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    preferences.setPreferences({ 
      cookiesAccepted: false, 
      analyticsConsent: false 
    });
    setShowBanner(false);
  };

  const handleCustomize = () => {
    // Could open a preferences modal here
    // For now, just accept essential cookies
    preferences.setPreferences({ 
      cookiesAccepted: true, 
      analyticsConsent: false 
    });
    setShowBanner(false);
  };

  // Don't render on server or if banner shouldn't show
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg ${className}`}
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              🍪 We use cookies
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We use essential cookies to make our site work. We'd also like to set optional 
              analytics cookies to help us improve it. We won't set optional cookies unless 
              you enable them.{' '}
              <a 
                href="/privacy" 
                className="underline"
                style={{ color: 'var(--primary)' }}
              >
                Read our privacy policy
              </a>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              Decline
            </button>
            
            <button
              onClick={handleCustomize}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              Essential only
            </button>
            
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: 'var(--primary)'
              }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 