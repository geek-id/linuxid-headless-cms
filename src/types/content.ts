export interface SchemaMarkup {
  type: "Article" | "BlogPosting" | "TechArticle" | "Tutorial" | "Review" | "Product";
  datePublished: string;
  dateModified?: string;
  readingTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
  mainEntityOfPage?: string;
  headline?: string;
  image?: string | string[];
  wordCount?: number;
  inLanguage?: string;
  about?: string[];
  mentions?: string[];
}

export interface SEOMetadata {
  // Core SEO fields (simplified format - matching Ansible Tower review)
  title?: string;
  description?: string;
  keywords?: string[];
  // Extended fields (generated automatically by parser)
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: SchemaMarkup; // Enhanced structured data
  // Additional SEO fields (auto-generated)
  focusKeyword?: string;
  metaRobots?: string;
  breadcrumbTitle?: string;
  socialTitle?: string;
  socialDescription?: string;
}

export interface ImageMetadata {
  url: string;
  key: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
}

export interface BaseContent {
  id: string;
  slug: string;
  title: string;
  content: string; // markdown content
  excerpt?: string;
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    name: string;
    email: string;
    avatar?: string;
  };
  seo: SEOMetadata;
  tags?: string[];
  category?: string;
  featuredImage?: ImageMetadata;
  images?: ImageMetadata[]; // Images used in content
  // Post-level fields from new format
  canonical?: string;
  schema?: SchemaMarkup;
  readingTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export interface BlogPost extends BaseContent {
  type: 'post';
  series?: string;
  seriesOrder?: number;
  // Note: readingTime, schema, and difficulty are now inherited from BaseContent
}

export interface Page extends BaseContent {
  type: 'page';
  template?: string;
  parentId?: string;
  order?: number;
}

export interface Review extends BaseContent {
  type: 'review';
  rating?: number;
  productName?: string;
  productUrl?: string;
  productImage?: ImageMetadata;
  pros?: string[];
  cons?: string[];
  verdict?: string;
}

export type ContentType = BlogPost | Page | Review;

export interface ContentQuery {
  type?: 'post' | 'page' | 'review';
  published?: boolean;
  featured?: boolean;
  category?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ContentResponse<T = ContentType> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Frontmatter {
  title: string;
  slug?: string;
  excerpt?: string;
  featured?: boolean;
  published?: boolean;
  publishedAt?: string;
  author?: string;
  category?: string;
  tags?: string | string[];
  seo?: Partial<SEOMetadata>;
  schema?: Partial<SchemaMarkup>; // Add schema support to frontmatter
  canonical?: string; // Add canonical URL support at post level
  featuredImage?: string | ImageMetadata;
  images?: string[] | ImageMetadata[];
  // Enhanced content metadata
  readingTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  // Type-specific fields
  rating?: number;
  productName?: string;
  productUrl?: string;
  productImage?: string | ImageMetadata;
  pros?: string[];
  cons?: string[];
  verdict?: string;
  template?: string;
  parentId?: string;
  order?: number;
  series?: string;
  seriesOrder?: number;
}

// Image upload related types
export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
    size: number;
    type: string;
  };
  error?: string;
  message?: string;
} 