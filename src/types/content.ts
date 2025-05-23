export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: any; // JSON-LD structured data
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
}

export interface BlogPost extends BaseContent {
  type: 'post';
  readingTime?: number;
  series?: string;
  seriesOrder?: number;
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
  featuredImage?: string | ImageMetadata;
  images?: string[] | ImageMetadata[];
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