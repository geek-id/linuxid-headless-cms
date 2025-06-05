import Prism from 'prismjs';

// Import basic languages first
import 'prismjs/components/prism-markup'; // Required for HTML/XML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';

// Conditionally import other languages that depend on base languages
if (typeof window === 'undefined') {
  try {
    // Server-side imports
    require('prismjs/components/prism-bash');
    require('prismjs/components/prism-typescript');
    require('prismjs/components/prism-yaml');
    require('prismjs/components/prism-jsx');
    require('prismjs/components/prism-tsx');
  } catch (error) {
    console.warn('Some Prism.js components failed to load:', error);
  }
}

// Language aliases mapping
const LANGUAGE_ALIASES: Record<string, string> = {
  'html': 'markup',
  'xml': 'markup',
  'svg': 'markup',
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'sh': 'bash',
  'shell': 'bash',
  'zsh': 'bash',
  'fish': 'bash',
  'powershell': 'bash',
  'ps1': 'bash',
  'cmd': 'bash',
  'bat': 'bash',
  'yml': 'yaml',
  'text': 'text',
  'txt': 'text',
  'plain': 'text'
};

// Get normalized language
function getNormalizedLanguage(lang: string): string {
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_ALIASES[normalized] || normalized;
}

// Check if language is supported by Prism
function isLanguageSupported(language: string): boolean {
  return language in Prism.languages;
}

// Escape HTML to prevent XSS and CSS breaking
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Highlight code with Prism.js
export function highlightCode(code: string, language: string = 'text'): string {
  try {
    const normalizedLang = getNormalizedLanguage(language);
    
    // If language is not supported, return escaped HTML
    if (!isLanguageSupported(normalizedLang)) {
      console.warn(`Language "${language}" (${normalizedLang}) not supported by Prism.js`);
      return escapeHtml(code);
    }
    
    // Use Prism to highlight the code
    const highlighted = Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang);
    return highlighted;
  } catch (error) {
    console.warn(`Failed to highlight code for language "${language}":`, error);
    // Fallback to escaped HTML if highlighting fails
    return escapeHtml(code);
  }
}

// Enhanced code renderer for marked.js
export function createCodeRenderer() {
  return function(code: string, language: string | undefined): string {
    const lang = language || 'text';
    const normalizedLang = getNormalizedLanguage(lang);
    const highlightedCode = highlightCode(code, lang);
    
    // Create the HTML structure with proper classes and data attributes
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${lang}</span>
        <button class="copy-code-btn" onclick="copyCodeToClipboard(this)" title="Copy to clipboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
        </button>
      </div>
      <pre class="code-block language-${normalizedLang}" data-language="${lang}"><code class="language-${normalizedLang}">${highlightedCode}</code></pre>
    </div>`;
  };
}

// Client-side copy functionality (to be added to global scope)
export const copyCodeScript = `
window.copyCodeToClipboard = function(button) {
  const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
  const text = codeBlock.textContent || codeBlock.innerText;
  
  navigator.clipboard.writeText(text).then(() => {
    const originalContent = button.innerHTML;
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>';
    button.setAttribute('title', 'Copied!');
    
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.setAttribute('title', 'Copy to clipboard');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};
`;

// CSS for code highlighting (to be included in globals.css)
export const codeHighlightingCSS = `
/* Code Block Wrapper */
.code-block-wrapper {
  margin: 2rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--code-bg, #2d3748);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

/* Code Block Header */
.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--code-header-bg, #1a202c);
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.code-language {
  color: var(--text-muted, #a0a0a0);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-code-btn {
  background: none;
  border: none;
  color: var(--text-muted, #a0a0a0);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-code-btn:hover {
  color: var(--primary);
  background: var(--bg-secondary);
}

/* Code Block Styling */
.code-block {
  margin: 0;
  padding: 1.5rem;
  background: var(--code-bg, #2d3748);
  color: var(--code-text, #e2e8f0);
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  tab-size: 4;
}

.code-block code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  border-radius: 0;
}

/* Prism.js Theme Integration */
.code-block .token.comment,
.code-block .token.prolog,
.code-block .token.doctype,
.code-block .token.cdata {
  color: #90a4ae;
  font-style: italic;
}

.code-block .token.punctuation {
  color: #9e9e9e;
}

.code-block .token.property,
.code-block .token.tag,
.code-block .token.boolean,
.code-block .token.number,
.code-block .token.constant,
.code-block .token.symbol,
.code-block .token.deleted {
  color: #f07178;
}

.code-block .token.selector,
.code-block .token.attr-name,
.code-block .token.string,
.code-block .token.char,
.code-block .token.builtin,
.code-block .token.inserted {
  color: #c3e88d;
}

.code-block .token.operator,
.code-block .token.entity,
.code-block .token.url,
.code-block .language-css .token.string,
.code-block .style .token.string {
  color: #89ddff;
}

.code-block .token.atrule,
.code-block .token.attr-value,
.code-block .token.keyword {
  color: #c792ea;
}

.code-block .token.function,
.code-block .token.class-name {
  color: #82aaff;
}

.code-block .token.regex,
.code-block .token.important,
.code-block .token.variable {
  color: #f78c6c;
}

/* HTML/Markup specific highlighting */
.code-block .token.tag .token.tag,
.code-block .token.tag .token.punctuation {
  color: #f07178;
}

.code-block .token.attr-name {
  color: #ffcb6b;
}

.code-block .token.attr-value,
.code-block .token.attr-value .token.punctuation {
  color: #c3e88d;
}

/* Bash/Shell specific highlighting */
.code-block .token.function {
  color: #82aaff;
}

.code-block .token.parameter {
  color: #ffcb6b;
}

/* Dark mode adjustments */
[data-theme="dark"] .code-block-wrapper {
  --code-bg: #1a202c;
  --code-header-bg: #2d3748;
  --code-text: #e2e8f0;
}

/* Light mode adjustments */
[data-theme="light"] .code-block-wrapper {
  --code-bg: #f7fafc;
  --code-header-bg: #edf2f7;
  --code-text: #2d3748;
}

/* Responsive design */
@media (max-width: 768px) {
  .code-block {
    padding: 1rem;
    font-size: 0.8rem;
  }
  
  .code-block-header {
    padding: 0.5rem 1rem;
  }
}

/* Scrollbar styling for code blocks */
.code-block::-webkit-scrollbar {
  height: 8px;
}

.code-block::-webkit-scrollbar-track {
  background: var(--code-bg);
}

.code-block::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.code-block::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
`; 