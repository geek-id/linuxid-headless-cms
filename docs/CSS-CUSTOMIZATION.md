# 🎨 CSS Customization Guide

Complete guide to customizing the styling and appearance of your LinuxID Pure Static Site Generator.

## 📁 **CSS File Locations**

### **Primary CSS Files**
- **`src/app/globals.css`** - Main CSS file with global styles, custom properties, and component styles
- **`tailwind.config.ts`** - Tailwind CSS configuration for colors, fonts, spacing, animations
- **Component files** - Individual component styling using Tailwind classes

## 🎯 **Quick Customization**

### **1. Change Brand Colors**

**In `src/app/globals.css`:**
```css
:root {
  /* Change these to your brand colors */
  --primary-color: #3b82f6;    /* Your main brand color */
  --secondary-color: #64748b;   /* Your accent color */
  --accent-color: #10b981;      /* Highlight color */
  --danger-color: #ef4444;      /* Error/warning color */
}
```

**In `tailwind.config.ts`:**
```typescript
// Primary brand colors - customize these!
primary: {
  500: "#3b82f6",   // Main primary color - change this!
  // ... other shades will be auto-generated
},
```

### **2. Change Typography**

**In `src/app/globals.css`:**
```css
:root {
  --font-size-base: 16px;       /* Base font size */
  --line-height-base: 1.6;      /* Line spacing */
}

body {
  font-family: var(--font-inter), Inter, system-ui, sans-serif;
}
```

**In `tailwind.config.ts`:**
```typescript
fontFamily: {
  sans: ["Your-Font", "Inter", "system-ui", "sans-serif"],
  serif: ["Your-Serif-Font", "Georgia", "serif"],
  mono: ["Your-Mono-Font", "JetBrains Mono", "monospace"],
},
```

### **3. Adjust Spacing & Layout**

**In `src/app/globals.css`:**
```css
:root {
  --container-padding: 1rem;    /* Page padding */
  --section-spacing: 4rem;      /* Spacing between sections */
}
```

## 🏗️ **Detailed Customization**

### **🎨 Color System**

#### **CSS Custom Properties (globals.css)**
```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: #171717;
  
  /* Brand colors - modify these! */
  --primary-color: #3b82f6;      /* Blue */
  --secondary-color: #64748b;     /* Gray */
  --accent-color: #10b981;        /* Green */
  --danger-color: #ef4444;        /* Red */
  
  /* Dark mode overrides */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --primary-color: #60a5fa;      /* Lighter for dark mode */
    --secondary-color: #94a3b8;    /* Lighter for dark mode */
  }
}
```

#### **Tailwind Color Palette (tailwind.config.ts)**
```typescript
colors: {
  // Your custom brand colors
  primary: {
    50: "#eff6ff",    // Lightest
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",   // Main color - CUSTOMIZE THIS!
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",   // Darkest
  },
  
  // Add your own custom colors
  brand: {
    500: "#your-color", // Your specific brand color
  }
}
```

### **🔤 Typography System**

#### **Font Configuration**
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ["Your-Primary-Font", "Inter", "system-ui", "sans-serif"],
  serif: ["Your-Serif-Font", "Georgia", "serif"],
  mono: ["Your-Code-Font", "JetBrains Mono", "monospace"],
},

fontSize: {
  'xs': '0.75rem',     // 12px
  'sm': '0.875rem',    // 14px  
  'base': '1rem',      // 16px - Default
  'lg': '1.125rem',    // 18px
  'xl': '1.25rem',     // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
  '5xl': '3rem',       // 48px
  '6xl': '3.75rem',    // 60px
  '7xl': '4.5rem',     // 72px
},
```

#### **Global Typography Styles**
```css
/* src/app/globals.css */
body {
  font-family: var(--font-inter), Inter, system-ui, sans-serif;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Prose (blog content) styling */
.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  color: var(--foreground);
  font-weight: 700;
}

.prose a {
  color: var(--primary-color);
  text-decoration: none;
}
```

### **🎭 Animation System**

#### **Custom Animations (tailwind.config.ts)**
```typescript
animation: {
  "fade-in": "fadeIn 0.5s ease-in-out",
  "slide-up": "slideUp 0.3s ease-out",
  "slide-down": "slideDown 0.3s ease-out",
  "scale-in": "scaleIn 0.2s ease-out",
  "bounce-soft": "bounceSoft 1s ease-in-out infinite",
  "pulse-slow": "pulse 3s ease-in-out infinite",
},

keyframes: {
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  slideUp: {
    "0%": { transform: "translateY(10px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  // ... more animations
},
```

#### **Usage in Components**
```jsx
// Using Tailwind animation classes
<div className="animate-fade-in">Content fades in</div>
<div className="animate-slide-up">Content slides up</div>
<div className="hover:animate-bounce-soft">Bounces on hover</div>

// Using custom CSS classes
<div className="animate-fade-in-up">Custom animation</div>
```

### **🔧 Component Styling**

#### **Pre-built CSS Classes (globals.css)**
```css
/* Card hover effects */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Glass morphism effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Search component enhancements */
.search-dropdown {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

#### **Usage Examples**
```jsx
// In your React components
<div className="card-hover bg-white rounded-lg p-6">
  Hoverable card
</div>

<div className="glass-morphism p-4">
  Glass effect container  
</div>

<h1 className="gradient-text text-4xl font-bold">
  Gradient text effect
</h1>
```

### **📐 Layout & Spacing**

#### **Container System**
```css
/* src/app/globals.css */
.container-custom {
  max-width: 1200px;      /* Adjust max width */
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
```

#### **Responsive Spacing**
```typescript
// tailwind.config.ts
spacing: {
  '18': '4.5rem',      // 72px
  '88': '22rem',       // 352px  
  '128': '32rem',      // 512px
},
```

### **🌈 Gradient System**

#### **Pre-defined Gradients (tailwind.config.ts)**
```typescript
backgroundImage: {
  'gradient-primary': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  'gradient-secondary': 'linear-gradient(135deg, #64748b, #94a3b8)', 
  'gradient-accent': 'linear-gradient(135deg, #10b981, #06b6d4)',
  'gradient-warm': 'linear-gradient(135deg, #f59e0b, #ef4444)',
  'gradient-cool': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
},
```

#### **Usage**
```jsx
<div className="bg-gradient-primary p-8 text-white">
  Gradient background
</div>

<h1 className="bg-gradient-accent bg-clip-text text-transparent">
  Gradient text
</h1>
```

## 🎯 **Specific Customization Examples**

### **1. Homepage Hero Section**
```jsx
// In src/app/page.tsx - Hero section styling
<section className="bg-gradient-primary text-white py-20">
  <div className="container-custom">
    <h1 className="text-5xl font-bold mb-6 animate-fade-in">
      Your Site Title
    </h1>
    <p className="text-xl opacity-90 animate-slide-up">
      Your site description
    </p>
  </div>
</section>
```

### **2. Card Components**
```jsx
// Post/Review cards with custom styling
<article className="card-hover glass-morphism rounded-2xl p-6 space-y-4">
  <h2 className="text-2xl font-bold text-primary-600">
    Post Title
  </h2>
  <p className="text-secondary-600">
    Post excerpt...
  </p>
</article>
```

### **3. Search Component Styling**
```jsx
// In SearchBox component
<div className="search-dropdown rounded-xl shadow-glass max-h-96 overflow-y-auto">
  {/* Search results */}
</div>
```

### **4. Navigation Styling**
```jsx
// Navigation with glass morphism
<nav className="glass-morphism sticky top-0 z-50 border-b border-white/20">
  <div className="container-custom">
    {/* Navigation content */}
  </div>
</nav>
```

## 🔍 **Responsive Design**

### **Breakpoint System**
```css
/* Tailwind default breakpoints */
/* sm: 640px */
/* md: 768px */  
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */

/* Usage examples */
<div className="text-base md:text-lg lg:text-xl">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

### **Mobile-First Approach**
```jsx
// Default (mobile) → tablet → desktop
<div className="
  p-4           /* Mobile: 16px padding */
  md:p-6        /* Tablet: 24px padding */  
  lg:p-8        /* Desktop: 32px padding */
  
  text-sm       /* Mobile: 14px text */
  md:text-base  /* Tablet: 16px text */
  lg:text-lg    /* Desktop: 18px text */
">
  Responsive content
</div>
```

## 🛠️ **Development Workflow**

### **1. Testing Styles**
```bash
# Start development server to see changes live
npm run dev

# Open http://localhost:3000
# Edit CSS files and see instant updates
```

### **2. Building for Production**
```bash
# Build optimized CSS
npm run build

# Tailwind automatically purges unused styles
# Final CSS bundle will be minimal
```

### **3. Debugging Styles**
```bash
# Check Tailwind classes are working
# Use browser dev tools
# Look for console errors

# Lint CSS
npm run lint
```

## 📱 **Component-Specific Styling**

### **Search Component (`src/components/SearchBox.tsx`)**
The search component uses these key classes:
- `search-dropdown` - Main search dropdown styling
- `backdrop-blur-sm` - Glass effect
- `shadow-glass` - Custom shadow for glass morphism

### **Layout Component (`src/app/layout.tsx`)**
The root layout sets global styles:
- Font loading and CSS variables
- Meta tags and SEO
- Global color scheme

### **Page Components (`src/app/page.tsx`, etc.)**
Individual pages use:
- `container-custom` - Consistent page containers
- `card-hover` - Interactive card effects
- Tailwind utility classes for layout

## 🎨 **Design System**

### **Color Usage Guidelines**
- **Primary**: Main brand color, buttons, links
- **Secondary**: Text, borders, subtle elements  
- **Accent**: Highlights, badges, special elements
- **Success**: Confirmations, positive feedback
- **Warning**: Cautions, important notices
- **Error**: Errors, critical alerts

### **Typography Scale**
- **Headings**: `text-4xl`, `text-3xl`, `text-2xl`, `text-xl`
- **Body**: `text-base` (default), `text-lg` (large)
- **Small**: `text-sm`, `text-xs`
- **Code**: Use `font-mono` class

### **Spacing Scale**
- **Tight**: `space-y-2`, `gap-2` (8px)
- **Normal**: `space-y-4`, `gap-4` (16px)  
- **Loose**: `space-y-6`, `gap-6` (24px)
- **Very loose**: `space-y-8`, `gap-8` (32px)

---

## 🚀 **Quick Start Checklist**

1. **✅ Change brand colors** in `globals.css` and `tailwind.config.ts`
2. **✅ Update typography** with your preferred fonts
3. **✅ Customize spacing** and layout variables
4. **✅ Test responsive design** on different screen sizes
5. **✅ Add custom animations** if needed
6. **✅ Build and deploy** to see changes live

**🎨 Your site styling is now completely customizable!** 