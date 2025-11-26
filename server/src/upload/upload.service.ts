import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenemedi.');
    }

    const backendUrl = process.env.BackendUrl;

    return {
      url: `${backendUrl}/uploads/${folder}/${file.filename}`,
      filename: file.filename,
      folder: folder,
    };
  }

  async deleteFile(filename: string, folder: string) {
    const fs = require('fs/promises');
    const path = require('path');

    try {
      const filePath = path.join(process.cwd(), 'uploads', folder, filename);
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { success: true };
      }
      throw new BadRequestException('Dosya silinemedi.');
    }
  }
}
