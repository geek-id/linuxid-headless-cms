'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className={`header ${className}`}>
      <nav className="nav container">
        <Link href="/" className="logo" onClick={closeMobileMenu}>
          <Image
            src="/static/img/linux-id_logo.png"
            alt={siteConfig.siteName}
            width={78}
            height={0}
            style={{ height: 'auto' }}
          />
          {siteConfig.siteName}
        </Link>
        
        {/* Desktop Menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}>
          <li>
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/posts" 
              className={`nav-link ${isActive('/posts') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              href="/reviews" 
              className={`nav-link ${isActive('/reviews') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Reviews
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
          </li>
          <li className="mobile-theme-toggle">
            <ThemeToggle />
          </li>
        </ul>

        <div className="header-actions">
          <ThemeToggle />
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
} 