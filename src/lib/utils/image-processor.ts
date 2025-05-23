import sharp from 'sharp';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'auto';
  progressive?: boolean;
}

export interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha: boolean;
}

export class ImageProcessor {
  private static defaultOptions: ImageProcessingOptions = {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 85,
    format: 'auto',
    progressive: true,
  };

  static async getImageInfo(buffer: Buffer): Promise<ImageInfo> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length,
      hasAlpha: metadata.hasAlpha || false,
    };
  }

  static async processImage(
    buffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const opts = { ...this.defaultOptions, ...options };
    let image = sharp(buffer);
    
    const metadata = await image.metadata();
    
    // Resize if needed
    if (
      (opts.maxWidth && metadata.width && metadata.width > opts.maxWidth) ||
      (opts.maxHeight && metadata.height && metadata.height > opts.maxHeight)
    ) {
      image = image.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Optimize based on format
    const originalFormat = metadata.format;
    let targetFormat = opts.format;
    
    // Auto-detect best format
    if (targetFormat === 'auto') {
      if (metadata.hasAlpha) {
        targetFormat = 'png';
      } else if (originalFormat === 'png' && !metadata.hasAlpha) {
        targetFormat = 'jpeg';
      } else {
        targetFormat = originalFormat as 'jpeg' | 'png' | 'webp';
      }
    }

    // Apply format-specific optimizations
    switch (targetFormat) {
      case 'jpeg':
        image = image.jpeg({
          quality: opts.quality,
          progressive: opts.progressive,
          mozjpeg: true,
        });
        break;
      
      case 'png':
        image = image.png({
          compressionLevel: 9,
          progressive: opts.progressive,
        });
        break;
      
      case 'webp':
        image = image.webp({
          quality: opts.quality,
          effort: 6,
        });
        break;
    }

    return await image.toBuffer();
  }

  static async createResponsiveImages(
    buffer: Buffer,
    sizes: number[] = [640, 768, 1024, 1280, 1920]
  ): Promise<{ [key: string]: Buffer }> {
    const results: { [key: string]: Buffer } = {};
    const metadata = await sharp(buffer).metadata();
    
    for (const size of sizes) {
      if (metadata.width && size < metadata.width) {
        const resized = await sharp(buffer)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
        
        results[`${size}w`] = resized;
      }
    }
    
    // Original size
    results['original'] = buffer;
    
    return results;
  }

  static async generateThumbnail(
    buffer: Buffer,
    width: number = 300,
    height: number = 300
  ): Promise<Buffer> {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  static validateImageType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];
    
    return allowedTypes.includes(mimetype.toLowerCase());
  }

  static validateImageSize(buffer: Buffer, maxSize: number = 10 * 1024 * 1024): boolean {
    return buffer.length <= maxSize;
  }

  static getFileExtension(mimetype: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    
    return extensions[mimetype.toLowerCase()] || 'jpg';
  }

  static async optimizeForWeb(buffer: Buffer, mimetype: string): Promise<Buffer> {
    const options: ImageProcessingOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      format: 'auto',
      progressive: true,
    };

    // Special handling for different image types
    if (mimetype === 'image/png') {
      const metadata = await sharp(buffer).metadata();
      if (!metadata.hasAlpha) {
        options.format = 'jpeg';
      }
    }

    return await this.processImage(buffer, options);
  }
}

// Helper functions for easy use
export async function optimizeImage(
  buffer: Buffer,
  mimetype: string,
  options?: ImageProcessingOptions
): Promise<Buffer> {
  return ImageProcessor.processImage(buffer, options);
}

export async function validateImage(buffer: Buffer, mimetype: string): Promise<boolean> {
  try {
    const typeValid = ImageProcessor.validateImageType(mimetype);
    const sizeValid = ImageProcessor.validateImageSize(buffer);
    
    if (!typeValid || !sizeValid) {
      return false;
    }

    // Try to get metadata to ensure it's a valid image
    await ImageProcessor.getImageInfo(buffer);
    return true;
  } catch {
    return false;
  }
}

export async function createImageThumbnail(
  buffer: Buffer,
  width?: number,
  height?: number
): Promise<Buffer> {
  return ImageProcessor.generateThumbnail(buffer, width, height);
} 