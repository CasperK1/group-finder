const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const {S3Client, DeleteObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const Redis = require('ioredis');

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  // Signed URL for getting and downloading files from S3
  async getFileDownloadUrl(key, expiresIn = 900) {
    if (!key) return null;
    // Check redis
    const cacheKey = `s3url:${key}:${expiresIn}`;
    const cachedUrl = await this.redis.get(cacheKey);
    if (cachedUrl) {
      console.log('Returning cached URL');
      return cachedUrl;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      });

      // Generate URL that expires in 15 minutes if no expiration time is provided
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresIn
      });
      // Cache the URL with slightly shorter expiration to prevent serving expired URLs
      const cacheTTL = Math.floor(expiresIn * 0.95);
      await this.redis.set(cacheKey, signedUrl, 'EX', cacheTTL);

      return signedUrl;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

// Uploader for profile pictures
  uploadProfilePicture() {
    return multer({
      storage: multerS3({
        s3: this.s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
          cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 10);
          cb(null, `profile-pictures/${uniqueSuffix}-${file.originalname}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = [
          '.jpg', '.jpeg', '.png', '.gif',
        ];

        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`), false);
        }
      },
      limits: {
        fileSize: 3 * 1024 * 1024 // 3MB limit
      }
    }).single('image');
  }

// Uploader for group files
  uploadGroupFile() {
    return multer({
      storage: multerS3({
        s3: this.s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
          cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 10);
          cb(null, `group-files/${uniqueSuffix}-${file.originalname}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = [
          // Documents
          '.pdf', '.doc', '.docx', '.dot', '.dotx', '.xls', '.xlsx', '.xlt', '.xltx', '.ppt', '.pptx',
          '.pot', '.potx', '.odt', '.ott', '.ods', '.ots', '.odp', '.otp', '.odg', '.rtf', '.txt', '.csv',

          // Code
          '.py', '.java', '.c', '.cpp', '.cs', '.js', '.json',
          '.css', '.html', '.php', '.rb', '.swift', '.go',
          '.rs', '.ts', '.md', '.yaml', '.yml', '.pl', '.sh',

          // Images
          '.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.webp',

          // Archives
          '.zip', '.rar', '.7z', '.tar', '.gz',
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for group files
      }
    }).single('file');
  }

// Delete file from S3. Key: file folder+name in S3 bucket (e.g. profile-pictures/1234-filename.jpg)
  async deleteFile(key) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      });
      await this.s3Client.send(deleteCommand);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file');
    }
  }
}

module.exports = new S3Service();