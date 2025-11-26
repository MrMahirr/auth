import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadService {

  uploadFile(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenemedi.');
    }

    // Backend adresin (Canlıya alırken .env dosyasından çekmelisin)
    const backendUrl = 'http://localhost:3000';

    // Dönen URL: http://localhost:3000/uploads/blogs/resim-123.jpg
    return {
      url: `${backendUrl}/uploads/${folder}/${file.filename}`,
      filename: file.filename,
      folder: folder
    };
  }
}