import { initializeConfigs } from '@/lib/config/file-storage';

let initialized = false;

export function initializeApp() {
  if (!initialized) {
    console.log('🚀 Initializing LinuxID Headless CMS...');
    
    try {
      // Initialize file-based configurations
      initializeConfigs();
      
      console.log('✅ File-based configuration system initialized');
      console.log('📁 Configuration files created in .config/ directory');
      console.log('🔐 Admin users will be managed through configuration files');
      console.log('💾 No database required - everything is file-based!');
      
      initialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize configuration system:', error);
      throw error;
    }
  }
}

// Auto-initialize on import (for server-side usage)
if (typeof window === 'undefined') {
  initializeApp();
} 