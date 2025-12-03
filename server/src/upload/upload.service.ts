import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('File upload doesnt successful.');
    }

    const backendUrl = process.env.BackendUrl;

    return {
      url: `${backendUrl}/uploads/${folder}/${file.filename}`,
      filename: file.filename,
      folder: folder,
    };
  }

  async deleteFile(filename: string, folder: string) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', folder, filename);
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return { success: true };
      }
      throw new BadRequestException('File doesnt delete.');
    }
  }
}
