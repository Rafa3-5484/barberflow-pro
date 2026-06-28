import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<{ url: string; key: string }> {
    const targetDir = path.join(this.uploadDir, folder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = path.join(targetDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const url = `/uploads/${folder}/${filename}`;
    const key = `${folder}/${filename}`;

    return { url, key };
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'general'): Promise<{ url: string; key: string }[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );

    return results;
  }

  async deleteFile(key: string): Promise<void> {
    const filepath = path.join(this.uploadDir, key);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      this.logger.log(`Deleted file: ${key}`);
    } else {
      throw new BadRequestException(`File not found: ${key}`);
    }
  }

  getFileUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
