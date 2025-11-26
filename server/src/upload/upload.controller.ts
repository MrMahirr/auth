import { Controller, Post, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerOptions } from './multer.config';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions)) // Config'i buraya bağladık
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string // URL'den ?folder= bilgisini alıyoruz
  ) {
    // Interceptor dosyayı kaydetti, şimdi URL'i oluşturması için servise gönderiyoruz
    return this.uploadService.uploadFile(file, folder);
  }
}