import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
}

export interface StorageConfig {
  provider: 'cloudflare_r2' | 'aws_s3' | 's3_compatible';
  bucket: string;
  publicUrl: string;
  region?: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
}

class CloudStorage {
  private s3Client: S3Client;
  private config: StorageConfig;

  constructor() {
    this.config = this.getStorageConfig();
    this.s3Client = this.createS3Client();
  }

  private getStorageConfig(): StorageConfig {
    const provider = process.env.STORAGE_PROVIDER as 'cloudflare_r2' | 'aws_s3' | 's3_compatible' || 'cloudflare_r2';
    
    switch (provider) {
      case 'cloudflare_r2':
        return {
          provider: 'cloudflare_r2',
          bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL!,
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
          endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
          region: 'auto'
        };
      
      case 'aws_s3':
        return {
          provider: 'aws_s3',
          bucket: process.env.AWS_S3_BUCKET_NAME!,
          publicUrl: process.env.AWS_S3_PUBLIC_URL!,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          region: process.env.AWS_REGION || 'us-east-1'
        };
      
      case 's3_compatible':
        return {
          provider: 's3_compatible',
          bucket: process.env.S3_BUCKET_NAME!,
          publicUrl: process.env.S3_PUBLIC_URL!,
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          endpoint: process.env.S3_ENDPOINT!,
          region: process.env.S3_REGION || 'us-east-1'
        };
      
      default:
        throw new Error(`Unsupported storage provider: ${provider}`);
    }
  }

  private createS3Client(): S3Client {
    const clientConfig: any = {
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    };

    // Add endpoint for Cloudflare R2 and S3-compatible services
    if (this.config.endpoint) {
      clientConfig.endpoint = this.config.endpoint;
    }

    // Force path style for S3-compatible services
    if (this.config.provider !== 'aws_s3') {
      clientConfig.forcePathStyle = true;
    }

    return new S3Client(clientConfig);
  }

  private generateKey(originalName: string, folder: string = 'images'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const uuid = uuidv4().split('-')[0];
    const ext = originalName.split('.').pop();
    return `${folder}/${timestamp}/${uuid}.${ext}`;
  }

  private async processImage(buffer: Buffer, mimetype: string): Promise<Buffer> {
    const quality = parseInt(process.env.IMAGE_QUALITY || '85');
    
    try {
      let processedBuffer = buffer;
      
      // Resize large images and optimize
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      // Resize if image is too large (max 2048px width)
      if (metadata.width && metadata.width > 2048) {
        image.resize(2048, null, { 
          withoutEnlargement: true, 
          fit: 'inside' 
        });
      }
      
      // Optimize based on format
      if (mimetype === 'image/jpeg') {
        processedBuffer = await image.jpeg({ quality }).toBuffer();
      } else if (mimetype === 'image/png') {
        processedBuffer = await image.png({ quality: Math.round(quality / 10) }).toBuffer();
      } else if (mimetype === 'image/webp') {
        processedBuffer = await image.webp({ quality }).toBuffer();
      } else {
        processedBuffer = await image.toBuffer();
      }
      
      return processedBuffer;
    } catch (error) {
      console.error('Image processing error:', error);
      return buffer; // Return original buffer if processing fails
    }
  }

  async uploadImage(
    buffer: Buffer, 
    originalName: string, 
    mimetype: string,
    folder: string = 'images'
  ): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
      if (!allowedTypes.includes(mimetype)) {
        throw new Error(`File type ${mimetype} is not allowed`);
      }

      // Validate file size
      const maxSize = parseInt(process.env.MAX_IMAGE_SIZE || '10485760'); // 10MB default
      if (buffer.length > maxSize) {
        throw new Error(`File size exceeds maximum allowed size of ${maxSize} bytes`);
      }

      // Process image (resize, optimize)
      const processedBuffer = await this.processImage(buffer, mimetype);
      
      const key = this.generateKey(originalName, folder);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: processedBuffer,
        ContentType: mimetype,
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      const url = `${this.config.publicUrl}/${key}`;

      return {
        url,
        key,
        size: processedBuffer.length,
        type: mimetype,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSignedUploadUrl(key: string, mimetype: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        ContentType: mimetype,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
    } catch (error) {
      console.error('Signed URL error:', error);
      throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    folder: string = 'files'
  ): Promise<UploadResult> {
    try {
      const key = this.generateKey(originalName, folder);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        Metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      const url = `${this.config.publicUrl}/${key}`;

      return {
        url,
        key,
        size: buffer.length,
        type: mimetype,
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getPublicUrl(key: string): string {
    return `${this.config.publicUrl}/${key}`;
  }
}

// Singleton instance
export const cloudStorage = new CloudStorage();

// Helper functions
export async function uploadImageToCloud(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder?: string
): Promise<UploadResult> {
  return cloudStorage.uploadImage(buffer, originalName, mimetype, folder);
}

export async function deleteImageFromCloud(key: string): Promise<void> {
  return cloudStorage.deleteImage(key);
}

export async function uploadFileToCloud(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder?: string
): Promise<UploadResult> {
  return cloudStorage.uploadFile(buffer, originalName, mimetype, folder);
} 