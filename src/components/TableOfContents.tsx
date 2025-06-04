'use client';

import { useEffect, useState } from 'react';
import { Twitter, Facebook, Mail, Linkedin } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  postTitle: string;
  postUrl: string;
}

export default function TableOfContents({ content, postTitle, postUrl }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));
      let id = heading.id;
      
      // Generate ID if not present
      if (!id) {
        id = text.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        heading.id = id;
      }
      
      return { id, text, level };
    });
    
    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Track scroll position and highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -80% 0%',
      }
    );

    // Observe all headings
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${postTitle}`);
    const body = encodeURIComponent(`I thought you might find this interesting: ${postUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (tocItems.length === 0) {
    return null;
  }

  // Only show TOC if there are at least 3 headings for better consistency
  if (tocItems.length < 3) {
    return null;
  }

  return (
    <div className="toc-sidebar">
      {/* Table of Contents */}
      <div className="toc-section">
        <h3 className="toc-title">CONTENTS</h3>
        <nav className="toc-nav">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`toc-item ${activeId === item.id ? 'active' : ''}`}
              style={{
                paddingLeft: `${(item.level - 1) * 1.2}rem`,
              }}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>

      {/* Share Section */}
      <div className="share-section">
        <h3 className="share-title">SHARE:</h3>
        <div className="share-buttons">
          <button
            onClick={shareOnTwitter}
            className="share-button"
            title="Share on Twitter"
          >
            <Twitter size={20} />
          </button>
          <button
            onClick={shareOnFacebook}
            className="share-button"
            title="Share on Facebook"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="share-button"
            title="Share on LinkedIn"
          >
            <Linkedin size={20} />
          </button>
          <button
            onClick={shareViaEmail}
            className="share-button"
            title="Share via Email"
          >
            <Mail size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} 